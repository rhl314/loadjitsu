use sqlx::sqlite::{SqlitePool, SqliteQueryResult};
use sqlx::Error;

pub struct RunResponseDocument {
    pub unique_id: String,
    pub status: String,
    pub timeMs: u64,
    pub latencyMs: u64,
    pub stepUniqueId: String,
    pub error: String,
    pub statusCode: u64,
}

impl RunResponseDocument {
    pub async fn insert(
        run_response_document: RunResponseDocument,
        pool: &SqlitePool,
    ) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO RunResponseDocuments (unique_id, status, timeMs, latencyMs, stepUniqueId, error, statusCode) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(run_response_document.unique_id)
            .bind(run_response_document.status)
            .bind(run_response_document.timeMs as i64)
            .bind(run_response_document.latencyMs as i64)
            .bind(run_response_document.stepUniqueId)
            .bind(run_response_document.error)
            .bind(run_response_document.statusCode as i64).execute(pool).await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        database_service::database_service::DatabaseService,
        file_service::file_service::FileService, models::RunResponseDocument,
    };

    #[tokio::test]
    async fn it_should_save_run_response_document_correctly() {
        let run_response_document = RunResponseDocument {
            unique_id: String::from("uniqueid"),
            status: String::from("OK"),
            timeMs: 0,
            latencyMs: 0,
            stepUniqueId: String::from("something"),
            error: String::from("hello"),
            statusCode: 200,
        };
        let path = FileService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error = RunResponseDocument::insert(run_response_document, &pool).await;
        assert!(saved_or_error.is_ok());
    }
}
