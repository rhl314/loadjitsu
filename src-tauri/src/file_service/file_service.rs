use std::f32::consts::E;
use std::fs;
use std::fs::File;

use anyhow::anyhow;
use anyhow::Result;
use base64::decode;
use base64::engine::general_purpose;
use base64::Engine;
use platform_dirs::AppDirs;
use sha2::Digest;
use sha2::Sha256;
use std::env;
use sysinfo::Pid;

use std::io::{self, Read};
use sysinfo::{ProcessExt, System, SystemExt};
use uuid::Uuid;

use crate::schema::ExecutionDocuments::pid;

pub struct FileService;

impl FileService {
    pub fn get_app_name() -> String {
        return String::from("loadjitsu");
    }
    pub fn decode_path(encoded: &str) -> Result<String> {
        match decode(encoded) {
            Ok(bytes) => match String::from_utf8(bytes) {
                Ok(decoded) => Ok(decoded),
                Err(e) => Err(anyhow!("Failed to convert bytes to string: {}", e)),
            },
            Err(e) => Err(anyhow!("Failed to decode base64: {}", e)),
        }
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
    pub fn ensure_file_exists(file_path: &str) -> Result<()> {
        if fs::metadata(file_path).is_ok() {
            Ok(())
        } else {
            let file = File::create(file_path)?;
            Ok(())
        }
    }

    pub fn does_file_exists(file_path: &str) -> Result<bool> {
        if fs::metadata(file_path).is_ok() {
            Ok(true)
        } else {
            Ok(false)
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
    pub fn current_exe_signature() -> anyhow::Result<String> {
        // Get the path to the current executable
        let exe_path = env::current_exe()?;

        // Open the file
        let mut file = File::open(exe_path)?;

        // Create a SHA256 object
        let mut hasher = Sha256::new();

        // Read the file and update the hasher
        let mut buffer = [0; 1024]; // Buffer to read chunks of the file
        loop {
            let count = file.read(&mut buffer)?;
            if count == 0 {
                break;
            }
            hasher.update(&buffer[..count]);
        }

        // Calculate the checksum
        let result = hasher.finalize();

        // Convert the hash to a hexadecimal string
        Ok(format!("{:x}", result))
    }

    pub fn is_process_alive(pid_str: &str) -> anyhow::Result<bool> {
        let pid_parsed = pid_str.parse::<usize>()?;
        let mut system = System::new_all();
        system.refresh_all();
        Ok(system.process(Pid::from(pid_parsed)).is_some())
    }
}
