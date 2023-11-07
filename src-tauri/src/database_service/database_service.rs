use diesel::Connection;
use diesel::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationError, MigrationHarness};
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");
use anyhow::anyhow;
use sqlx::sqlite::SqlitePool;
use sqlx::Pool;
use sqlx::Row;
use sqlx::Sqlite;

use crate::api_service::api_service::ApiService;
use crate::file_service::file_service::FileService;

use crate::models::DocumentRevision;
use crate::protos::ipc::RunDocument;

pub struct DatabaseService;
impl DatabaseService {
    pub fn run_migrations(database_path: &str) -> anyhow::Result<SqliteConnection> {
        let mut connection = SqliteConnection::establish(database_path)?;
        let ranOrError = connection.run_pending_migrations(MIGRATIONS);
        match ranOrError {
            Ok(_) => Ok(connection),
            Err(e) => Err(anyhow!("Error in migration")),
        }
    }
    pub async fn connection(database_path: &str) -> anyhow::Result<Pool<Sqlite>> {
        let pool = SqlitePool::connect(database_path).await?;
        Ok(pool)
    }
}
#[cfg(test)]
mod tests {
    use crate::{api_service::api_service::ApiService, file_service::file_service::FileService};

    #[test]
    fn it_should_correctly_setup_database_connection() {
        let connection = super::DatabaseService::run_migrations(":memory:");
        assert!(connection.is_ok());
    }
    #[test]
    fn it_should_create_file_on_disk_on_setting_up_connection() {
        use std::fs;
        let file_path = FileService::get_temporary_file_path().unwrap();
        println!("{}", file_path);
        let connection = super::DatabaseService::run_migrations(&file_path);
        assert!(connection.is_ok());
        let metadata = fs::metadata(&file_path).unwrap();
        assert!(metadata.is_file());
        fs::remove_file(&file_path).unwrap()
    }
}
