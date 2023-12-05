use serde::Serialize;
use sqlx::sqlite::{SqlitePool, SqliteQueryResult};
use sqlx::{Error, FromRow, Row};

#[derive(Debug)]
pub struct Execution {
    pub unique_id: String,
    pub execution_document_id: String,
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
    pub timestamp: i64, // Unix timestamp in seconds
    pub count: i64,
}

impl Execution {
    pub async fn insert(run_response_document: Execution, pool: &SqlitePool) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO Executions (unique_id, execution_document_id, status, timeMs, latencyMs, stepUniqueId, error, statusCode, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(run_response_document.unique_id)
            .bind(run_response_document.execution_document_id)
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

    pub async fn aggregate_results_by_execution_document_id(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<ExecutionStatusCount>, sqlx::Error> {
        println!("execution_document_id: {}", execution_document_id);
        let rows = sqlx::query(
            r#"
        SELECT 
            status,
            CAST (strftime('%s', "created_at") as INTEGER) as "timestamp",
            COUNT(*) as "count"
        FROM 
            Executions
        WHERE
            execution_document_id = ?
        GROUP BY 
            status, "timestamp"
        ORDER BY 
            "timestamp" ASC
        "#,
        )
        .bind(&execution_document_id)
        .fetch_all(pool)
        .await?;

        let results = rows
            .into_iter()
            .map(|row| {
                // dbg!(&row);
                ExecutionStatusCount {
                    status: row.get("status"),
                    timestamp: row.get("timestamp"),
                    count: row.get("count"),
                }
            })
            .collect();

        Ok(results)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        database_service::database_service::DatabaseService,
        file_service::file_service::FileService, models::Execution,
    };

    #[tokio::test]
    async fn it_should_save_run_response_document_correctly() {
        let run_response_document = Execution {
            unique_id: String::from("uniqueid"),
            execution_document_id: String::from("run_uniqueid"),
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
        let saved_or_error = Execution::insert(run_response_document, &pool).await;
        assert!(saved_or_error.is_ok());
    }
}
