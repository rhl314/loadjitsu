use anyhow::Result;
use sha2::Digest;
use sha2::Sha256;

pub struct FileService;

impl FileService {
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

    pub fn get_hash(input: &str) -> Result<String> {
        let mut hasher = Sha256::new();
        hasher.update(input);
        let result = hasher.finalize();
        // Convert the hash to a hex string
        let hex_string = format!("{:x}", result);
        Ok(hex_string)
    }
}
