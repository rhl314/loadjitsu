use serde::Serialize;
use sqlx::sqlite::{SqlitePool, SqliteQueryResult};
use sqlx::{Error, FromRow, Row};

use crate::file_service::file_service::FileService;

use super::{execution_document, ExecutionDocument};

#[derive(Debug, Clone)]
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
    pub completed_at: String,
    pub run_second: i32,
}

#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionStatusCount {
    pub status: String,
    pub run_second: i32, // Unix timestamp in seconds
    pub count: i64,
}

impl Execution {
    pub async fn insert(run_response_document: Execution, pool: &SqlitePool) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO Executions (unique_id, execution_document_id, status, timeMs, latencyMs, stepUniqueId, error, statusCode, created_at, completed_at, run_second) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(run_response_document.unique_id)
            .bind(run_response_document.execution_document_id)
            .bind(run_response_document.status)
            .bind(run_response_document.timeMs as i64)
            .bind(run_response_document.latencyMs as i64)
            .bind(run_response_document.stepUniqueId)
            .bind(run_response_document.error)
            .bind(run_response_document.statusCode as i64)
            .bind(run_response_document.created_at)
            .bind(run_response_document.completed_at)
            .bind(run_response_document.run_second)
            .execute(pool).await?;
        Ok(())
    }

    pub async fn get_execution_document(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> anyhow::Result<ExecutionDocument> {
        let mut execution_document = ExecutionDocument {
            id: "TODO".to_string(),
            document_revision_id: "TODO".to_string(),
            pid: "".to_string(),
            status: "NOT_FOUND".to_string(),
            started_at: None,
            completed_at: None,
        };
        let execution_document_or_empty =
            ExecutionDocument::get_execution_document_by_id(pool, execution_document_id).await?;

        if let Some(some_execution_document) = execution_document_or_empty {
            execution_document = some_execution_document;
        }

        let is_process_alive = FileService::is_process_alive(execution_document.pid.as_str())?;
        if is_process_alive {
            execution_document.status = "RUNNING".to_string();
        } else if !is_process_alive & execution_document.status.ne("COMPLETED") {
            execution_document.status = "ABORTED".to_string();
        }
        Ok(execution_document)
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
            run_second,
            COUNT(*) as "count"
        FROM 
            Executions
        WHERE
            execution_document_id = ?
        GROUP BY 
            status, run_second
        ORDER BY 
            run_second ASC
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
                    run_second: row.get("run_second"),
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
            completed_at: String::from("2021-01-01"),
            run_second: 0,
        };
        let path = FileService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error = Execution::insert(run_response_document, &pool).await;
        assert!(saved_or_error.is_ok());
    }
}
