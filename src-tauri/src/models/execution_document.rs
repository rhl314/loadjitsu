use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePool;
use sqlx::FromRow;
use uuid::Uuid;

use crate::database_service::database_service::DatabaseService;
use crate::file_service::app_service::AppService;
#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct ExecutionDocument {
    pub id: String,
    pub document_revision_id: String,
    pub pid: String,
    pub status: String,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
}

impl ExecutionDocument {
    pub async fn create_new_execution_document(
        pool: &SqlitePool,
        document_revision_id: String,
    ) -> anyhow::Result<ExecutionDocument> {
        let id = Uuid::new_v4().to_string();
        let status = "PENDING";
        let run = ExecutionDocument {
            id: id.clone(),
            document_revision_id: document_revision_id.clone(),
            status: status.to_string(),
            pid: "".to_string(),
            started_at: None,
            completed_at: None,
        };
        let query = sqlx::query(
            "INSERT INTO ExecutionDocuments (id, document_revision_id, status)
         VALUES ($1, $2, $3)",
        )
        .bind(id)
        .bind(document_revision_id)
        .bind(status);

        query.execute(pool).await?;
        Ok(run)
    }
    pub async fn update_execution_document(
        pool: &SqlitePool,
        run: &ExecutionDocument,
    ) -> anyhow::Result<()> {
        let query = sqlx::query(
            "UPDATE ExecutionDocuments SET status = $1, pid = $2, started_at = $3, completed_at = $4 WHERE id = $5",
        )
        .bind(&run.status)
        .bind(&run.pid)
        .bind(&run.started_at)
        .bind(&run.completed_at)
        .bind(&run.id);
        query.execute(pool).await?;
        Ok(())
    }

    pub async fn complete_execution_document(pool: &SqlitePool, pid: String) -> anyhow::Result<()> {
        println!("Completing run with pid: {}", pid);
        let query = sqlx::query(
            "UPDATE ExecutionDocuments SET status = 'COMPLETED', completed_at = datetime('now') WHERE pid = $1",
        )
        .bind(pid);
        query.execute(pool).await?;
        Ok(())
    }

    pub async fn get_all_execution_documents(
        encoded_document_path: &str,
    ) -> anyhow::Result<Vec<ExecutionDocument>> {
        let decoded_document_path = AppService::decode_path(encoded_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let runs = sqlx::query_as::<_, ExecutionDocument>(
            "SELECT id, document_revision_id, pid, status, started_at, completed_at FROM ExecutionDocuments",
        )
        .fetch_all(&pool)
        .await?;
        Ok(runs)
    }

    pub async fn get_execution_document_by_id(
        pool: &SqlitePool,
        id: &str,
    ) -> anyhow::Result<Option<ExecutionDocument>> {
        let execution_document =
            sqlx::query_as::<_, ExecutionDocument>("SELECT * FROM ExecutionDocuments WHERE id = ?")
                .bind(id)
                .fetch_optional(pool)
                .await?;

        Ok(execution_document)
    }
}

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use crate::{
        database_service::database_service::DatabaseService, file_service::app_service::AppService,
        models::ExecutionDocument,
    };

    #[tokio::test]
    async fn it_should_create_a_new_execution_documents() {
        let document_revision_id = Uuid::new_v4().to_string();
        let path = AppService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error =
            ExecutionDocument::create_new_execution_document(&pool, document_revision_id.clone())
                .await;
        assert!(saved_or_error.is_ok());
        let run = saved_or_error.unwrap();
        assert!(run.document_revision_id == document_revision_id);
    }
}
