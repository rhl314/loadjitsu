// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate base64;

use prost::Message;
use std::collections::HashMap;
use std::time::Duration;
use ureq::{Agent, AgentBuilder};

use serde::{Deserialize, Serialize};

use crate::protos::ipc::HttpAction;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust now!", name)
}

#[tauri::command]
fn getRecentRuns() -> Vec<super::types::common::IRunFile> {
    let mut v: Vec<super::types::common::IRunFile> = Vec::new();

    /*let file = RunFile {
        path: String::from("hello"),
    };
    v.push(file);*/
    v
}

#[tauri::command]
fn runApiStepOnce(serialized: &str) -> String {
    println!("{serialized}");
    let result = base64::decode(serialized);
    match result {
        Ok(uint8) => {
            let apiStep = super::protos::ipc::ApiStep::decode(uint8.as_slice()).unwrap();
            let agent: Agent = ureq::AgentBuilder::new()
                .timeout_read(Duration::from_secs(5))
                .timeout_write(Duration::from_secs(5))
                .build();
            let method = super::protos::ipc::HttpAction::as_str_name(&apiStep.action());
            let request = agent.request(method, &apiStep.endpoint);
            //request.set("Content-Type", value);
            //request.send(reader);
            let response: ureq::Response = request.call().unwrap();
            let status = response.status();

            println!("{}", status);
            let runResponse = super::protos::ipc::RunResponse {
                unique_id: String::from("uniqueid"),
                has_logs: false,
                logs: [].to_vec(),
                status: super::protos::ipc::run_response::Status::Exception.into(),
                description: String::from("wrong"),
                time: 0.0,
                int_values: HashMap::new(),
                string_values: HashMap::new(),
                float_values: HashMap::new(),
                step_unique_id: String::from("something"),
                error: String::from("hello"),
            };
            String::from("gello")
        }
        Err(E) => {
            let runResponse = super::protos::ipc::RunResponse {
                unique_id: String::from("uniqueid"),
                has_logs: false,
                logs: [].to_vec(),
                status: super::protos::ipc::run_response::Status::Exception.into(),
                description: String::from("wrong"),
                time: 0.0,
                int_values: HashMap::new(),
                string_values: HashMap::new(),
                float_values: HashMap::new(),
                step_unique_id: String::from("something"),
                error: String::from("hello"),
            };
            String::from("gello")
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::gui::runApiStepOnce;

    #[test]
    fn it_works() {
        let serialized =
            "CgpqSzVxeG5pN2lIEhdodHRwczovL2h0dHBiaW4ub3JnL2dldCCIJyoSEhBhcHBsaWNhdGlvbi9qc29u";
        runApiStepOnce(serialized);
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}

pub fn spawnUi() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            getRecentRuns,
            greet,
            runApiStepOnce
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
