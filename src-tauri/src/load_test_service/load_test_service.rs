use crate::api_service::api_service::ApiService;
use crate::database_service::database_service::DatabaseService;
use crate::document_service::document_service::DocumentService;
use crate::models::DocumentRevision;
use crate::models::ExecutionDocument;
use crate::{file_service::app_service::AppService, protos::ipc::RunDocument};
use anyhow::anyhow;

use std::env;

use std::process;
use std::process::Command;
use std::time::Duration;
use tokio::time::sleep;

pub struct LoadTestService;
impl LoadTestService {
    pub async fn run_load_test_in_background(
        document_revision_id: String,
        run_document_path: String,
    ) -> anyhow::Result<ExecutionDocument> {
        let current_exe: String = env::current_exe()?.to_str().unwrap().to_string();
        let decoded_document_path = DocumentService::decode_document_path(&run_document_path)?;
        let pool = DatabaseService::connection(&decoded_document_path).await?;
        let mut run =
            ExecutionDocument::create_new_execution_document(&pool, document_revision_id.clone())
                .await?;
        let child = Command::new(current_exe)
            .arg("--mode")
            .arg("CLI")
            .arg("--document-revision-id")
            .arg(document_revision_id)
            .arg("--run-document-path")
            .arg(run_document_path)
            .arg("--unique-id")
            .arg(&run.id)
            .spawn()?;
        let child_id = child.id();
        run.pid = child_id.to_string();
        run.started_at = Some(chrono::Utc::now().to_rfc3339());
        run.status = "RUNNING".to_string();
        ExecutionDocument::update_execution_document(&pool, &run).await?;
        Ok(run)
    }

    pub async fn run_load_test(
        run_document: RunDocument,
        run_document_path: String,
        run_unique_id: String,
    ) -> anyhow::Result<()> {
        if run_document.api_steps.len() == 0 {
            return Err(anyhow!("No API steps found"));
        }
        if run_document.configuration.is_none() {
            return Err(anyhow!("No configuration found"));
        }
        let configuration = run_document.configuration.unwrap();
        let test_duration_in_seconds = configuration.duration_in_seconds;
        let requests_per_second = configuration.rps;
        let api_step_or_none = run_document.api_steps.first();
        if api_step_or_none.is_none() {
            return Err(anyhow!("No API steps found"));
        }
        let api_step = api_step_or_none.unwrap().clone();
        let request_interval = Duration::from_secs(1) / requests_per_second as u32;
        let mut handles = Vec::new();

        for run_second in 1..=test_duration_in_seconds {
            let outer_run_document_path = run_document_path.clone();
            let outer_run_unique_id = run_unique_id.clone();
            let outer_api_step = api_step.clone();
            for _ in 0..requests_per_second {
                let inner_run_document_path = outer_run_document_path.clone();
                let inner_run_unique_id = outer_run_unique_id.clone();
                let inner_api_step = outer_api_step.clone();
                let handle = tokio::spawn(async move {
                    let pool = DatabaseService::connection(&inner_run_document_path)
                        .await
                        .unwrap();
                    ApiService::run_and_record_response(
                        &inner_api_step,
                        inner_run_unique_id.as_str(),
                        run_second,
                        &pool,
                    )
                    .await
                });
                handles.push(handle);
                sleep(request_interval).await;
            }
        }
        for handle in handles {
            let _ = handle.await;
        }
        let pool = DatabaseService::connection(&run_document_path).await?;

        let pid = process::id().to_string();
        println!("pid: {}", pid);
        ExecutionDocument::complete_execution_document(&pool, pid).await?;
        Ok(())
    }
    pub async fn run_load_test_from_cli_args(
        run_document_path_encoded: String,
        document_revision_id: String,
        run_unique_id: String,
    ) -> anyhow::Result<()> {
        let decoded_run_document_path = AppService::decode_path(&run_document_path_encoded)?;
        let file_exists = AppService::does_file_exists(&decoded_run_document_path)?;
        if file_exists != true {
            return Err(anyhow!("Loadjitsu file not found"));
        }
        DatabaseService::run_migrations(&decoded_run_document_path)?;
        let pool = DatabaseService::connection(&decoded_run_document_path).await?;
        let document_revision =
            DocumentRevision::get_document_revision_by_id(&pool, &document_revision_id).await?;

        if let Some(latest_document_revision) = document_revision {
            let value = latest_document_revision.value;
            let run_document = ApiService::deserialize_run_document(&value)?;
            return LoadTestService::run_load_test(
                run_document,
                decoded_run_document_path,
                run_unique_id,
            )
            .await;
        } else {
            return Err(anyhow!("No document revisions found"));
        }
    }
}
