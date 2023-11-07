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
            Err(e) => Err(anyhow!("Erro in migration")),
        }
    }
    pub async fn connection(database_path: &str) -> anyhow::Result<Pool<Sqlite>> {
        let pool = SqlitePool::connect(database_path).await?;
        Ok(pool)
    }
    async fn get_document_revision_by_id(
        pool: &SqlitePool,
        id: &str,
    ) -> anyhow::Result<Option<DocumentRevision>> {
        let document_revision = sqlx::query_as::<_, DocumentRevision>(
            "SELECT id, value, created_at FROM DocumentRevisions WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;

        Ok(document_revision)
    }

    async fn create_or_update_document_revision(
        pool: &SqlitePool,
        input: DocumentRevision,
    ) -> anyhow::Result<()> {
        let existing = sqlx::query("SELECT EXISTS(SELECT 1 FROM DocumentRevisions WHERE id = ?)")
            .bind(&input.id)
            .fetch_one(pool)
            .await?
            .get::<i32, _>(0);

        if existing == 1 {
            // Record exists, so update it
            sqlx::query("UPDATE DocumentRevisions SET value = ?, created_at = ? WHERE id = ?")
                .bind(&input.value)
                .bind(input.created_at)
                .bind(&input.id)
                .execute(pool)
                .await?;
        } else {
            // Record does not exist, so insert it
            sqlx::query("INSERT INTO DocumentRevisions (id, value, created_at) VALUES (?, ?, ?)")
                .bind(&input.id)
                .bind(&input.value)
                .bind(input.created_at)
                .execute(pool)
                .await?;
        }

        Ok(())
    }
    pub async fn saveRunDocument(
        path: &str,
        run_document: RunDocument,
    ) -> anyhow::Result<RunDocument> {
        let pool = DatabaseService::connection(path).await?;
        let serialized = ApiService::serialize_run_document(&run_document)?;
        let id = FileService::get_hash(&serialized)?;
        let document_revision = DocumentRevision {
            id: id.clone(),
            value: serialized,
            created_at: chrono::Utc::now().to_rfc3339(),
        };
        DatabaseService::create_or_update_document_revision(&pool, document_revision).await?;

        Ok(run_document)
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

    #[tokio::test]
    async fn it_should_save_run_document_correctly() {
        let run_document = ApiService::generateNewRunDocument();
        let path = FileService::get_temporary_file_path().unwrap();
        super::DatabaseService::run_migrations(&path).unwrap();
        let saved_or_error = super::DatabaseService::saveRunDocument(&path, run_document).await;
        assert!(saved_or_error.is_ok());
    }
}
