use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::Row;
use sqlx::SqlitePool;
use uuid::uuid;

use crate::database_service::database_service::DatabaseService;
use crate::file_service::file_service::FileService;

#[derive(Debug, FromRow, Serialize, Deserialize)]
pub struct DocumentMeta {
    pub id: String,
    pub key: String,
    pub value_string: Option<String>,
    pub value_float: Option<f32>,
    pub value_integer: Option<i32>,
    pub value_datetime: Option<String>, // This requires the chrono crate
}

impl DocumentMeta {
    pub async fn save_string(key: &str, value: &str) -> anyhow::Result<()> {
        let path = FileService::get_metadata_file_path()?;
        let pool = DatabaseService::connection(&path).await?;
        let existing = sqlx::query("SELECT EXISTS(SELECT 1 FROM DocumentMeta WHERE key = ?)")
            .bind(key)
            .fetch_one(&pool)
            .await?
            .get::<i32, _>(0);

        if existing == 1 {
            // Record exists, so update itØ
            sqlx::query("UPDATE DocumentMeta SET value_string = ? WHERE key = ?")
                .bind(value)
                .bind(key)
                .execute(&pool)
                .await?;
        } else {
            // Record does not exist, so insert it
            sqlx::query("INSERT INTO DocumentMeta (id, key, value_string) VALUES (?, ?, ?)")
                .bind(uuid::Uuid::new_v4().to_string())
                .bind(key)
                .bind(value)
                .execute(&pool)
                .await?;
        }

        Ok(())
    }
    pub async fn get_string(key: &str) -> anyhow::Result<String> {
        let path = FileService::get_metadata_file_path()?;
        let pool = DatabaseService::connection(&path).await?;
        let document_meta =
            sqlx::query_as::<_, DocumentMeta>("SELECT * FROM DocumentMeta WHERE key = ?")
                .bind(key)
                .fetch_optional(&pool)
                .await?;

        Ok(document_meta.unwrap().value_string.unwrap())
    }
}
