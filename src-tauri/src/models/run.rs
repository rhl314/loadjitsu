use serde::{Deserialize, Serialize};
use sqlx::sqlite::{SqlitePool, SqliteQueryResult};
use sqlx::FromRow;
use uuid::Uuid;
#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct Run {
    pub id: String,
    pub document_revision_id: String,
    pub pid: Option<String>,
    pub status: String,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
}

impl Run {
    pub async fn create_new_run(
        pool: &SqlitePool,
        document_revision_id: String,
    ) -> anyhow::Result<Run> {
        let id = Uuid::new_v4().to_string();
        let status = "PENDING";
        let run = Run {
            id: id.clone(),
            document_revision_id: document_revision_id.clone(),
            status: status.to_string(),
            pid: None,
            started_at: None,
            completed_at: None,
        };
        let query = sqlx::query(
            "INSERT INTO Run (id, document_revision_id, status)
         VALUES ($1, $2, $3)",
        )
        .bind(id)
        .bind(document_revision_id)
        .bind(status);

        query.execute(pool).await?;
        Ok(run)
    }
    pub async fn update_run(pool: &SqlitePool, run: &Run) -> anyhow::Result<()> {
        let query = sqlx::query(
            "UPDATE Run SET status = $1, pid = $2, started_at = $3, completed_at = $4 WHERE id = $5",
        )
        .bind(&run.status)
        .bind(&run.pid)
        .bind(&run.started_at)
        .bind(&run.completed_at)
        .bind(&run.id);
        query.execute(pool).await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use crate::{
        database_service::database_service::DatabaseService,
        file_service::file_service::FileService, models::Run,
    };

    #[tokio::test]
    async fn it_should_create_a_new_run() {
        let document_revision_id = Uuid::new_v4().to_string();
        let path = FileService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error = Run::create_new_run(&pool, document_revision_id.clone()).await;
        assert!(saved_or_error.is_ok());
        let run = saved_or_error.unwrap();
        assert!(run.document_revision_id == document_revision_id);
    }
}
