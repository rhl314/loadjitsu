use std::f32::consts::E;
use std::fs;
use std::fs::File;

use anyhow::Result;
use base64::engine::general_purpose;
use base64::Engine;
use platform_dirs::AppDirs;
use sha2::Digest;
use sha2::Sha256;
use uuid::Uuid;

pub struct FileService;

impl FileService {
    pub fn get_app_name() -> String {
        return String::from("loadjitsu");
    }
    pub fn get_temporary_file_path() -> Result<String> {
        let named_temp_file = tempfile::NamedTempFile::new()?;
        let file_path_or_error = named_temp_file
            .path()
            .to_owned()
            .into_os_string()
            .into_string();
        match file_path_or_error {
            Ok(file_path) => Ok(file_path),
            Err(e) => Err(anyhow::anyhow!("Error in getting file path")),
        }
    }

    pub fn get_run_documents_file_path() -> anyhow::Result<String> {
        let app_name = FileService::get_app_name();
        let app_dirs = AppDirs::new(Some(app_name.as_str()), false);
        if let Some(app_dirs) = app_dirs {
            let data_dir = &app_dirs.data_dir;
            let data_dir = data_dir.to_str();
            fs::create_dir_all(&app_dirs.data_dir)?;
            if let Some(data_dir) = data_dir {
                let file_path = app_dirs.data_dir.join("run_document_files");
                if file_path.exists() != true {
                    File::create(&file_path)?;
                } else {
                }
                let result = file_path.into_os_string().into_string();
                match result {
                    Ok(file_path) => Ok(file_path),
                    Err(e) => Err(anyhow::anyhow!("Error in getting file path")),
                }
            } else {
                Err(anyhow::anyhow!("Could not get data directory"))
            }
        } else {
            Err(anyhow::anyhow!("Could not get app directory"))
        }
    }

    pub fn get_hash(input: &str) -> Result<String> {
        let mut hasher = Sha256::new();
        hasher.update(input);
        let result = hasher.finalize();
        // Convert the hash to a hex string
        let hex_string = format!("{:x}", result);
        Ok(hex_string)
    }
}
