use base64::{engine::general_purpose, Engine as _};
use platform_dirs::AppDirs;
use uuid::Uuid;

pub struct DocumentService;
impl DocumentService {
    pub fn get_temporary_document_path() -> Result<String, Box<dyn std::error::Error>> {
        let app_dirs = AppDirs::new(Some("loadjitsu"), false);
        if let Some(app_dirs) = app_dirs {
            let data_dir = app_dirs.data_dir;
            let data_dir = data_dir.to_str();
            let new_id = Uuid::new_v4().to_string();
            if let Some(temp_dir) = data_dir {
                let file_path = format!("{}/{}.loadjitsu", temp_dir, new_id);
                Ok(general_purpose::STANDARD_NO_PAD.encode(file_path))
            } else {
                Err("Could not get temporary directory".into())
            }
        } else {
            Err("Could not get temporary directory".into())
        }
    }
}
