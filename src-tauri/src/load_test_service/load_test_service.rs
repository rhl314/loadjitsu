use crate::api_service::api_service::ApiService;
use crate::database_service::database_service::DatabaseService;
use crate::models::DocumentRevision;
use crate::{file_service::file_service::FileService, protos::ipc::RunDocument};
use anyhow::anyhow;
use anyhow::Ok;

pub struct LoadTestService;
impl LoadTestService {
    pub async fn run_load_test(run_document: RunDocument) -> anyhow::Result<()> {
        Ok(())
    }
    pub async fn run_load_test_from_cli_args(
        run_document_path_encoded: String,
        document_revision_id: String,
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
            return LoadTestService::run_load_test(run_document).await;
        } else {
            return Err(anyhow!("No document revisions found"));
        }
    }
}
