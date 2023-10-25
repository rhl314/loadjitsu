use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct IRunFile {
    path: String,
}
