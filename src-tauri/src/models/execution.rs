use serde::Serialize;
use sqlx::sqlite::SqlitePool;
use sqlx::{FromRow, Row};

use crate::file_service::app_service::AppService;

use super::ExecutionDocument;

#[derive(Debug, Clone, FromRow, Serialize, serde::Deserialize)]
pub struct Execution {
    pub unique_id: String,
    pub execution_document_id: String,
    pub status: String,
    pub timeMs: i64,
    pub latencyMs: i64,
    pub stepUniqueId: String,
    pub error: String,
    pub statusCode: i64,
    pub created_at: String,
    pub completed_at: String,
    pub run_second: i32,
}

#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionCountByStatusAndRunSecond {
    pub status: String,
    pub run_second: i32, // Unix timestamp in seconds
    pub count: i64,
}
#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionCountByStatus {
    pub status: String,
    pub count: i64, // Unix timestamp in seconds
}
#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionSummary {
    pub max_response_time: i64,
    pub avg_response_time: f64,
    pub min_response_time: i64,
    pub max_latency: i64,
    pub avg_latency: f64,
    pub min_latency: i64,
}

#[derive(Debug, FromRow, Serialize, serde::Deserialize)]
pub struct ExecutionResults {
    pub execution_count_by_status: Vec<ExecutionCountByStatus>,
    pub execution_count_by_status_and_run_second: Vec<ExecutionCountByStatusAndRunSecond>,
    pub execution_summary: Vec<ExecutionSummary>,
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

        let is_process_alive = AppService::is_process_alive(execution_document.pid.as_str())?;
        if is_process_alive {
            if (execution_document.status.ne("REQUESTED_ABORT")) {
                execution_document.status = "RUNNING".to_string();
            }
        } else if !is_process_alive & execution_document.status.ne("COMPLETED") {
            execution_document.status = "ABORTED".to_string();
        }
        Ok(execution_document)
    }

    pub async fn get_execution_summary(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<ExecutionSummary>, sqlx::Error> {
        println!("execution_document_id: {}", execution_document_id);
        let rows = sqlx::query(
            r#"
                SELECT
                MAX(timeMs) as max_response_time, MIN(timeMs) as min_response_time, AVG(timeMs) as avg_response_time,
		        MAX(latencyMs) as max_latency, MIN(latencyMs) as min_latency, AVG(latencyMs) as avg_latency
                FROM 
            Executions
                WHERE
            execution_document_id = ?
        "#,
        )
        .bind(&execution_document_id)
        .fetch_all(pool)
        .await?;

        let results = rows
            .into_iter()
            .map(|row| {
                // dbg!(&row);
                ExecutionSummary {
                    max_response_time: row.get("max_response_time"),
                    avg_response_time: row.get("avg_response_time"),
                    min_response_time: row.get("min_response_time"),
                    max_latency: row.get("max_latency"),
                    avg_latency: row.get("avg_latency"),
                    min_latency: row.get("min_latency"),
                }
            })
            .collect();

        Ok(results)
    }

    pub async fn get_execution_count_by_status(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<ExecutionCountByStatus>, sqlx::Error> {
        println!("execution_document_id: {}", execution_document_id);
        let rows = sqlx::query(
            r#"
        SELECT 
            status,
            COUNT(*) as "count"
        FROM 
            Executions
        WHERE
            execution_document_id = ?
        GROUP BY 
            status
        "#,
        )
        .bind(&execution_document_id)
        .fetch_all(pool)
        .await?;

        let results = rows
            .into_iter()
            .map(|row| {
                // dbg!(&row);
                ExecutionCountByStatus {
                    status: row.get("status"),
                    count: row.get("count"),
                }
            })
            .collect();

        Ok(results)
    }

    pub async fn get_executions(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<Execution>, sqlx::Error> {
        println!("execution_document_id: {}", execution_document_id);
        let executions = sqlx::query_as::<_, Execution>(
            "SELECT * FROM Executions WHERE execution_document_id = ?",
        )
        .bind(execution_document_id)
        .fetch_all(pool)
        .await?;

        Ok(executions)
    }

    pub async fn get_execution_count_by_status_and_run_second(
        execution_document_id: &str,
        pool: &SqlitePool,
    ) -> Result<Vec<ExecutionCountByStatusAndRunSecond>, sqlx::Error> {
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
                ExecutionCountByStatusAndRunSecond {
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
        database_service::database_service::DatabaseService, file_service::app_service::AppService,
        models::Execution,
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
        let path = AppService::get_temporary_file_path().unwrap();
        DatabaseService::run_migrations(&path).unwrap();
        let pool = DatabaseService::connection(&path).await.unwrap();
        let saved_or_error = Execution::insert(run_response_document, &pool).await;
        assert!(saved_or_error.is_ok());
    }
}
