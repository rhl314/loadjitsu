use sqlx::{Database, Row, SqlitePool};

use crate::{
    database_service::database_service::DatabaseService, file_service::file_service::FileService,
    protos::ipc::RunDocument,
};

pub struct RunDocumentFile {
    pub id: String,
    pub path: String,
    pub title: String,
    pub saved_at: String,
}
impl RunDocumentFile {
    pub async fn register_run_document(
        run_document: &RunDocument,
        path_of_run_document: &str,
    ) -> anyhow::Result<RunDocumentFile> {
        let path = FileService::get_run_documents_file_path()?;
        println!("Path is {}", path);
        DatabaseService::run_migrations(&path)?;
        println!("Migrations ran");
        let run_document_file = RunDocumentFile {
            id: run_document.unique_id.clone(),
            path: path_of_run_document.to_string(),
            title: run_document.title.clone(),
            saved_at: chrono::Utc::now().to_rfc3339(),
        };
        let pool = DatabaseService::connection(&path).await?;
        RunDocumentFile::create_or_update_run_document_file(&pool, &run_document_file).await?;
        Ok(run_document_file)
    }

    pub async fn create_or_update_run_document_file(
        pool: &SqlitePool,
        input: &RunDocumentFile,
    ) -> anyhow::Result<()> {
        let existing = sqlx::query("SELECT EXISTS(SELECT 1 FROM RunDocumentFiles WHERE id = ?)")
            .bind(&input.id)
            .fetch_one(pool)
            .await?
            .get::<i32, _>(0);

        if existing == 1 {
            // Record exists, so update it
            sqlx::query(
                "UPDATE RunDocumentFiles SET title = ?, saved_at = ?, path = ? WHERE id = ?",
            )
            .bind(&input.title)
            .bind(&input.saved_at)
            .bind(&input.path)
            .execute(pool)
            .await?;
        } else {
            // Record does not exist, so insert it
            sqlx::query(
                "INSERT INTO RunDocumentFiles (id, title, saved_at, path) VALUES (?, ?, ?, ?)",
            )
            .bind(&input.id)
            .bind(&input.title)
            .bind(&input.saved_at)
            .bind(&input.path)
            .execute(pool)
            .await?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{api_service::api_service::ApiService, file_service::file_service::FileService};

    #[tokio::test]
    async fn it_should_save_run_document_correctly() {
        let run_document = ApiService::generateNewRunDocument();
        let path = FileService::get_temporary_file_path().unwrap();
        let saved_or_error =
            super::RunDocumentFile::register_run_document(&run_document, &path).await;
        // dbg!(saved_or_error.err());
        assert!(&saved_or_error.is_ok());
        let path = FileService::get_run_documents_file_path().unwrap();
        println!("Path is {}", path);
    }
}
