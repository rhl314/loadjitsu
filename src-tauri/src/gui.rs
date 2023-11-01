// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate base64;

use prost::Message;
use std::time::Duration;
use std::{collections::HashMap, error::Error};
use ureq::{Agent, AgentBuilder};

use serde::{Deserialize, Serialize};

use crate::api_service::api_service::ApiService;
use crate::protos::ipc::{ApiStep, HttpAction, RunResponse, RunStatus};
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

fn runApiStep(apiStep: ApiStep) -> RunResponse {
    let agent: Agent = ureq::AgentBuilder::new()
        .timeout_read(Duration::from_secs(5))
        .timeout_write(Duration::from_secs(5))
        .build();
    let method = HttpAction::as_str_name(&apiStep.action());
    let request = agent.request(method, &apiStep.endpoint);
    //request.set("Content-Type", value);
    //request.send(reader);
    let response: ureq::Response = request.call().unwrap();
    let status = response.status();

    println!("{}", status);
    let runResponse = RunResponse {
        unique_id: String::from("uniqueid"),
        has_logs: false,
        logs: [].to_vec(),
        status: RunStatus::Exception.into(),
        description: String::from("wrong"),
        time: 0,
        latency: 0,
        step_unique_id: String::from("something"),
        error: String::from("hello"),
        status_code: 200,
    };
    runResponse
}

#[tauri::command]
async fn runApiStepOnce(serialized: &str) -> Result<String, String> {
    let ranOrError = self::run_api_step_once_core(serialized).await;
    match ranOrError {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}
async fn run_api_step_once_core(serialized: &str) -> Result<String, Box<dyn std::error::Error>> {
    let api_step = super::protos::ipc::ApiStep::decode(base64::decode(serialized)?.as_slice())?;
    let response = ApiService::run(&api_step).await?;
    let serialized = ApiService::serialize_run_response(&response)?;
    Ok(serialized)
}
#[tauri::command]
fn runApiStepOnceOld(serialized: &str) -> String {
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

            let response: ureq::Response = request.call().unwrap();
            let status = response.status();

            println!("{}", status);
            let runResponse = super::protos::ipc::RunResponse {
                unique_id: String::from("uniqueid"),
                has_logs: false,
                logs: [].to_vec(),
                status: RunStatus::Exception.into(),
                description: String::from("wrong"),
                time: 0,
                latency: 0,
                step_unique_id: String::from("something"),
                error: String::from("hello"),
                status_code: 200,
            };
            String::from("gello")
        }
        Err(E) => {
            let runResponse = super::protos::ipc::RunResponse {
                unique_id: String::from("uniqueid"),
                has_logs: false,
                logs: [].to_vec(),
                status: RunStatus::Exception.into(),
                description: String::from("wrong"),
                time: 0,
                latency: 0,
                step_unique_id: String::from("something"),
                error: String::from("hello"),
                status_code: 200,
            };
            String::from("gello")
        }
    }
}

pub fn spawnUi() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            getRecentRuns,
            greet,
            runApiStepOnce,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
