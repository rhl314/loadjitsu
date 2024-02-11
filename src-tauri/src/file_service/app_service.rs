use std::fs;
use std::fs::File;

use anyhow::anyhow;
use anyhow::Result;
use base64::{engine::general_purpose::STANDARD, Engine as _};

use platform_dirs::AppDirs;
use sha2::Digest;
use sha2::Sha256;
use std::env;
use sysinfo::Pid;

use machine_uid;
use std::io::Read;
use sys_info;
use sysinfo::{System, SystemExt};
pub struct AppService;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MachineInfo {
    uid: String,
    memory: u64,
    num_cores: usize,
    kernal_version: Option<String>,
    os_version: Option<String>,
    host_name: Option<String>,
    name: Option<String>,
    distribution_id: String,
}

impl AppService {
    pub fn get_app_name() -> String {
        return String::from("loadjitsu");
    }
    pub fn get_machine_info() -> Result<MachineInfo> {
        let uidOrError = machine_uid::get();
        let uid = match uidOrError {
            Ok(uid) => uid,
            Err(e) => "".to_string(),
        };
        let mut system = System::new_all();
        system.refresh_all();

        Ok(MachineInfo {
            uid,
            memory: system.total_memory(),
            num_cores: system.cpus().len(),
            kernal_version: system.kernel_version(),
            os_version: system.long_os_version(),
            host_name: system.host_name(),
            name: system.name(),
            distribution_id: system.distribution_id(),
        })
    }
    pub fn decode_path(encoded: &str) -> Result<String> {
        // Calculate how much padding is needed
        let padding_needed = (4 - encoded.len() % 4) % 4;
        let padded_encoded = format!("{}{}", encoded, "=".repeat(padding_needed));
        println!("padded_encoded: {}", padded_encoded);

        match STANDARD.decode(padded_encoded) {
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
            Err(_e) => Err(anyhow::anyhow!("Error in getting file path")),
        }
    }
    pub fn ensure_file_exists(file_path: &str) -> Result<()> {
        if fs::metadata(file_path).is_ok() {
            Ok(())
        } else {
            let _file = File::create(file_path)?;
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

    pub fn get_metadata_file_path() -> anyhow::Result<String> {
        let app_name = AppService::get_app_name();
        let app_dirs = AppDirs::new(Some(app_name.as_str()), false);
        if let Some(app_dirs) = app_dirs {
            let data_dir = &app_dirs.data_dir;
            let data_dir = data_dir.to_str();
            fs::create_dir_all(&app_dirs.data_dir)?;
            if let Some(_data_dir) = data_dir {
                let file_path = app_dirs.data_dir.join("metadata");
                if file_path.exists() != true {
                    File::create(&file_path)?;
                } else {
                }
                let result = file_path.into_os_string().into_string();
                match result {
                    Ok(file_path) => Ok(file_path),
                    Err(_e) => Err(anyhow::anyhow!("Error in getting file path")),
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
