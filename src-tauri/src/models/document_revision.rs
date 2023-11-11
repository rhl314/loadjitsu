use chrono::{DateTime, Utc};
use sqlx::FromRow;
use sqlx::Row;
use sqlx::SqlitePool;

use crate::api_service::api_service::ApiService;
use crate::database_service::database_service::DatabaseService;
use crate::document_service::document_service::DocumentService;
use crate::file_service::file_service::FileService;
use crate::protos::ipc::RunDocument;

use super::RunDocumentFile;

#[derive(Debug, FromRow)]
pub struct DocumentRevision {
    pub id: String,
    pub value: String,
    pub created_at: String,
}

impl DocumentRevision {
    async fn get_document_revision_by_id(
        pool: &SqlitePool,
        id: &str,
    ) -> anyhow::Result<Option<DocumentRevision>> {
        let document_revision = sqlx::query_as::<_, DocumentRevision>(
            "SELECT id, value, created_at FROM DocumentRevisions WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;

        Ok(document_revision)
    }

    async fn exists_by_id(pool: &SqlitePool, id: &str) -> Result<bool, sqlx::Error> {
        let record = sqlx::query("SELECT id FROM DocumentRevisions WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await?;

        Ok(record.is_some())
    }
    pub async fn create_or_update_document_revision(
        pool: &SqlitePool,
        input: DocumentRevision,
    ) -> anyhow::Result<()> {
        let existing = sqlx::query("SELECT EXISTS(SELECT 1 FROM DocumentRevisions WHERE id = ?)")
            .bind(&input.id)
            .fetch_one(pool)
            .await?
            .get::<i32, _>(0);

        if existing == 1 {
            // Record exists, so update it
            sqlx::query("UPDATE DocumentRevisions SET value = ?, created_at = ? WHERE id = ?")
                .bind(&input.value)
                .bind(input.created_at)
                .bind(&input.id)
                .execute(pool)
                .await?;
        } else {
            // Record does not exist, so insert it
            sqlx::query("INSERT INTO DocumentRevisions (id, value, created_at) VALUES (?, ?, ?)")
                .bind(&input.id)
                .bind(&input.value)
                .bind(input.created_at)
                .execute(pool)
                .await?;
        }

        Ok(())
    }
    pub async fn saveRunDocument(
        path: &str,
        run_document: RunDocument,
    ) -> anyhow::Result<RunDocument> {
        let pool = DatabaseService::connection(path).await?;
        let serialized = ApiService::serialize_run_document(&run_document)?;
        let id = FileService::get_hash(&serialized)?;
        let document_revision = DocumentRevision {
            id: id.clone(),
            value: serialized,
            created_at: chrono::Utc::now().to_rfc3339(),
        };
        DocumentRevision::create_or_update_document_revision(&pool, document_revision).await?;

        Ok(run_document)
    }

    pub async fn saveSerializedRunDocument(
        encodedPath: &str,
        seralizedRunDocument: &str,
    ) -> anyhow::Result<()> {
        let decoded_document_path = DocumentService::decode_document_path(encodedPath)?;
        FileService::ensure_file_exists(&decoded_document_path)?;
        DatabaseService::run_migrations(&decoded_document_path)?;
        println!("decoded_document_path: {}", decoded_document_path);
        let deserialized_run_document = ApiService::deserialize_run_document(seralizedRunDocument)?;
        let pool = DatabaseService::connection(&decoded_document_path).await?;
        let id = FileService::get_hash(&seralizedRunDocument)?;
        let document_revision = DocumentRevision {
            id: id.clone(),
            value: String::from(seralizedRunDocument),
            created_at: chrono::Utc::now().to_rfc3339(),
        };
        DocumentRevision::create_or_update_document_revision(&pool, document_revision).await?;
        RunDocumentFile::register_run_document(&deserialized_run_document, &decoded_document_path)
            .await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{api_service::api_service::ApiService, file_service::file_service::FileService};

    #[tokio::test]
    async fn it_should_save_run_document_correctly() {
        let run_document = ApiService::generateNewRunDocument();
        let path = FileService::get_temporary_file_path().unwrap();
        super::DatabaseService::run_migrations(&path).unwrap();
        let saved_or_error = super::DocumentRevision::saveRunDocument(&path, run_document).await;
        assert!(saved_or_error.is_ok());
    }
}
