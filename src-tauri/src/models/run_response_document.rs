use serde::Serialize;
use sqlx::sqlite::{SqlitePool, SqliteQueryResult};
use sqlx::{Error, FromRow};

use crate::schema::RunResponseDocuments::run_unique_id;
#[derive(Debug)]
pub struct RunResponseDocument {
    pub unique_id: String,
    pub run_unique_id: String,
    pub status: String,
    pub timeMs: u64,
    pub latencyMs: u64,
    pub stepUniqueId: String,
    pub error: String,
    pub statusCode: u64,
    pub created_at: String,
}

#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionStatusCount {
    pub status: String,
    pub created_at: i64, // Unix timestamp in seconds
    pub count: i64,
}

impl RunResponseDocument {
    pub async fn insert(
        run_response_document: RunResponseDocument,
        pool: &SqlitePool,
    ) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO RunResponseDocuments (unique_id, run_unique_id, status, timeMs, latencyMs, stepUniqueId, error, statusCode, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(run_response_document.unique_id)
            .bind(run_response_document.run_unique_id)
            .bind(run_response_document.status)
            .bind(run_response_document.timeMs as i64)
            .bind(run_response_document.latencyMs as i64)
            .bind(run_response_document.stepUniqueId)
            .bind(run_response_document.error)
            .bind(run_response_document.statusCode as i64)
            .bind(run_response_document.created_at)
            .execute(pool).await?;
        Ok(())
    }

    pub async fn get_execution_results(
        filter_run_unique_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<ExecutionStatusCount>, sqlx::Error> {
        let aggregated_results = sqlx::query_as::<_, ExecutionStatusCount>(
            r#"
        SELECT 
            status,
            strftime('%s', created_at) as "created_at!: i64",
            COUNT(*) as "count!: i64"
        FROM 
            RunResponseDocuments
        WHERE
            created_at IS NOT NULL
            and
            run_unique_id = ?
        GROUP BY 
            status, created_at
        ORDER BY 
            created_at ASC
        "#,
        )
        .bind(&filter_run_unique_id)
        .fetch_all(pool)
        .await?;

        Ok(aggregated_results)
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
            run_unique_id: String::from("run_uniqueid"),
            status: String::from("OK"),
            timeMs: 0,
            latencyMs: 0,
            stepUniqueId: String::from("something"),
            error: String::from("hello"),
            statusCode: 200,
            created_at: String::from("2021-01-01"),
        };
        let path = FileService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error = RunResponseDocument::insert(run_response_document, &pool).await;
        assert!(saved_or_error.is_ok());
    }
}
