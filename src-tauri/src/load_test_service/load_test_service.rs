use crate::api_service::api_service::ApiService;
use crate::database_service::database_service::DatabaseService;
use crate::models::DocumentRevision;
use crate::{file_service::file_service::FileService, protos::ipc::RunDocument};
use anyhow::anyhow;
use reqwest::Client;
use std::time::Duration;
use tokio::time::{sleep, timeout};

pub struct LoadTestService;
impl LoadTestService {
    pub async fn run_load_test(
        run_document: RunDocument,
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
        let api_step = api_step_or_none.unwrap();
        let timeout_duration_in_ms = api_step.timeout_in_ms;
        let request_interval = Duration::from_secs(1) / requests_per_second as u32;
        let timeout_duration = Duration::from_millis(timeout_duration_in_ms as u64);
        let client = Client::new();

        for _ in 0..test_duration_in_seconds {
            let mut handles = Vec::new();

            for _ in 0..requests_per_second {
                let client_clone = client.clone();
                let url_clone = "http://localhost:3000";

                let handle = tokio::spawn(async move {
                    let start = tokio::time::Instant::now();
                    let result =
                        timeout(timeout_duration, client_clone.get(url_clone).send()).await;

                    match result {
                        Ok(Ok(response)) => {
                            let elapsed = start.elapsed();
                            let size = response.content_length().unwrap_or(0);
                            println!(
                                "Status: {}, Time: {:?}, Size: {} bytes",
                                response.status(),
                                elapsed,
                                size
                            );
                        }
                        Ok(Err(e)) => eprintln!("Request error: {}", e),
                        Err(_) => eprintln!("Request timed out"),
                    }
                });

                handles.push(handle);
                sleep(request_interval).await;
            }

            for handle in handles {
                let _ = handle.await;
            }
        }

        Ok(())
    }
    pub async fn run_load_test_from_cli_args(
        run_document_path_encoded: String,
        document_revision_id: String,
        run_unique_id: String,
    ) -> anyhow::Result<()> {
        let decoded_run_document_path = FileService::decode_path(&run_document_path_encoded)?;
        let file_exists = FileService::does_file_exists(&decoded_run_document_path)?;
        if file_exists != true {
            return Err(anyhow!("Loadjitsu file not found"));
        }
        DatabaseService::run_migrations(&decoded_run_document_path)?;
        let pool = DatabaseService::connection(&decoded_run_document_path).await?;
        let latest_document_revision =
            DocumentRevision::get_latest_document_revision(&pool).await?;

        if let Some(latest_document_revision) = latest_document_revision {
            let value = latest_document_revision.value;
            let run_document = ApiService::deserialize_run_document(&value)?;
            return LoadTestService::run_load_test(run_document, run_unique_id).await;
        } else {
            return Err(anyhow!("No document revisions found"));
        }
    }
}
