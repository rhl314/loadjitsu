
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
    pub async fn get_document_revision_by_id(
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
    pub async fn get_latest_document_revision(
        pool: &SqlitePool,
    ) -> anyhow::Result<Option<DocumentRevision>> {
        let document_revision = sqlx::query_as::<_, DocumentRevision>(
            "SELECT id, value, created_at FROM DocumentRevisions ORDER BY created_at DESC LIMIT 1",
        )
        .fetch_optional(pool)
        .await?;

        Ok(document_revision)
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
    ) -> anyhow::Result<String> {
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
        Ok(id)
    }

    pub async fn loadRunDocument(encodedPath: &str) -> anyhow::Result<RunDocument> {
        let decoded_document_path = DocumentService::decode_document_path(encodedPath)?;
        println!("decoded_document_path: {}", decoded_document_path);
        let file_exists = FileService::does_file_exists(&decoded_document_path)?;
        if file_exists == false {
            return Err(anyhow::anyhow!("DOCUMENT_NOT_FOUND"));
        }
        DatabaseService::run_migrations(&decoded_document_path)?;
        println!("ran migrations");
        let pool = DatabaseService::connection(&decoded_document_path).await?;
        let latest_document_revision =
            DocumentRevision::get_latest_document_revision(&pool).await?;
        if let Some(latest_document_revision) = latest_document_revision {
            let deserialized_run_document =
                ApiService::deserialize_run_document(&latest_document_revision.value)?;
            return Ok(deserialized_run_document);
        } else {
            return Ok(ApiService::generateNewRunDocument());
        }
    }

    pub async fn getRunDocumentByRevisionId(
        encodedPath: &str,
        documentRevisionId: &str,
    ) -> anyhow::Result<RunDocument> {
        let decoded_document_path = DocumentService::decode_document_path(encodedPath)?;
        println!("decoded_document_path: {}", decoded_document_path);
        let file_exists = FileService::does_file_exists(&decoded_document_path)?;
        if file_exists == false {
            return Err(anyhow::anyhow!("DOCUMENT_NOT_FOUND"));
        }
        DatabaseService::run_migrations(&decoded_document_path)?;
        println!("ran migrations");
        let pool = DatabaseService::connection(&decoded_document_path).await?;
        let document_revision =
            DocumentRevision::get_document_revision_by_id(&pool, documentRevisionId).await?;
        if let Some(latest_document_revision) = document_revision {
            let deserialized_run_document =
                ApiService::deserialize_run_document(&latest_document_revision.value)?;
            return Ok(deserialized_run_document);
        } else {
            return Ok(ApiService::generateNewRunDocument());
        }
    }

    pub async fn loadRunDocumentSerialized(encodedPath: &str) -> anyhow::Result<String> {
        println!("encodedPath: {}", encodedPath);
        let run_document = DocumentRevision::loadRunDocument(encodedPath).await?;
        let serialized_run_document = ApiService::serialize_run_document(&run_document)?;
        Ok(serialized_run_document)
    }

    pub async fn getSerializedRunDocumentByRevisionId(
        encodedPath: &str,
        documentRevisionId: &str,
    ) -> anyhow::Result<String> {
        println!("encodedPath: {}", encodedPath);
        let run_document =
            DocumentRevision::getRunDocumentByRevisionId(encodedPath, documentRevisionId).await?;
        let serialized_run_document = ApiService::serialize_run_document(&run_document)?;
        Ok(serialized_run_document)
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
