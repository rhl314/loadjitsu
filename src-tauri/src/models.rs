use chrono::{DateTime, Utc};
use sqlx::FromRow;
use sqlx::SqlitePool;

use crate::{api_service::api_service::ApiService, protos::ipc::RunDocument};

pub struct DocumentMeta {
    pub id: String,
    pub key: String,
    pub value_string: Option<String>,
    pub value_float: Option<f32>,
    pub value_integer: Option<i32>,
    pub value_datetime: Option<String>, // This requires the chrono crate
}

#[derive(Debug, FromRow)]
pub struct DocumentRevision {
    pub id: String,
    pub value: String,
    pub created_at: String,
}

impl DocumentRevision {
    async fn exists_by_id(pool: &SqlitePool, id: &str) -> Result<bool, sqlx::Error> {
        let record = sqlx::query("SELECT id FROM DocumentRevisions WHERE id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await?;

        Ok(record.is_some())
    }
}

#[cfg(test)]
mod tests {
    use crate::database_service::database_service::DatabaseService;

    fn it_should_handle_missing_exists_by_id() {
        let connection = DatabaseService::run_migrations(":memory:");
        assert!(connection.is_ok());
    }
}
