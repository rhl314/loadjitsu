// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate base64;

use prost::Message;
use std::time::Duration;

use ureq::Agent;

use crate::api_service::api_service::ApiService;

use crate::document_service::document_service::DocumentService;
use crate::load_test_service::load_test_service::LoadTestService;
use crate::models::execution::{ExecutionCountByStatusAndRunSecond, ExecutionResults};
use crate::models::{DocumentMeta, DocumentRevision, ExecutionDocument, RunDocumentFile};
use crate::protos::ipc::{ApiStep, HttpAction, RunResponse, RunStatus};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust now!", name)
}

#[tauri::command]
async fn getTemporaryDocumentPath() -> Result<String, String> {
    let ranOrError = DocumentService::get_temporary_document_path();
    match ranOrError {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn getRecentRuns() -> Result<Vec<RunDocumentFile>, String> {
    let ranOrError = RunDocumentFile::get_recent_runs().await;
    match ranOrError {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
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
    dbg!(response);
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
            let _runResponse = super::protos::ipc::RunResponse {
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
        Err(_E) => {
            let _runResponse = super::protos::ipc::RunResponse {
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

#[tauri::command]
async fn runLoadTest(
    runDocumentSerialized: &str,
    runDocumentPath: &str,
) -> Result<ExecutionDocument, String> {
    let savedOrError =
        DocumentRevision::saveSerializedRunDocument(runDocumentPath, runDocumentSerialized).await;

    match savedOrError {
        Ok(document_revision_id) => {
            println!("Saved successfully");
            println!("document_revision_id: {}", document_revision_id);
            println!("encoded_path: {}", runDocumentPath);
            let ran_or_error = LoadTestService::run_load_test_in_background(
                document_revision_id,
                runDocumentPath.to_string(),
            )
            .await;
            match ran_or_error {
                Ok(run) => Ok(run),
                Err(error) => Err(error.to_string()),
            }
        }
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn loadRunDocument(runDocumentPath: &str) -> Result<String, String> {
    let run_document_or_error = DocumentRevision::loadRunDocumentSerialized(runDocumentPath).await;
    match run_document_or_error {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn getRunDocumentByRevisionId(
    runDocumentPath: &str,
    documentRevisionId: &str,
    runMigrations: bool,
) -> Result<String, String> {
    let run_document_or_error = DocumentRevision::getSerializedRunDocumentByRevisionId(
        runDocumentPath,
        documentRevisionId,
        runMigrations,
    )
    .await;
    match run_document_or_error {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}
#[tauri::command]
async fn getExecutions(runDocumentPath: &str) -> Result<Vec<ExecutionDocument>, String> {
    let runs_or_error = ExecutionDocument::get_all_execution_documents(runDocumentPath).await;
    match runs_or_error {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn getExecutionResults(
    runDocumentPath: &str,
    executionDocumentId: &str,
) -> Result<ExecutionResults, String> {
    let runs_or_error =
        ApiService::get_execution_results(executionDocumentId, runDocumentPath).await;
    match runs_or_error {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn getExecutionDocument(
    runDocumentPath: &str,
    executionDocumentId: &str,
) -> Result<ExecutionDocument, String> {
    let runs_or_error =
        ApiService::get_execution_document(executionDocumentId, runDocumentPath).await;
    match runs_or_error {
        Ok(ran) => Ok(ran),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn saveMetaDataString(key: &str, value: &str) -> Result<(), String> {
    let saved_or_error = DocumentMeta::save_string(key, value).await;
    match saved_or_error {
        Ok(saved) => Ok(saved),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
async fn getMetaDataString(key: &str) -> Result<String, String> {
    let saved_or_error = DocumentMeta::get_string(key).await;
    match saved_or_error {
        Ok(saved) => Ok(saved),
        Err(error) => Err(error.to_string()),
    }
}

struct AppState {
    current_exe_signature: String,
}
pub fn spawnUi(current_exe_signature: String) {
    let state = AppState {
        current_exe_signature: current_exe_signature.clone(),
    };
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            getRecentRuns,
            greet,
            runApiStepOnce,
            getTemporaryDocumentPath,
            runLoadTest,
            loadRunDocument,
            getExecutions,
            getExecutionResults,
            getExecutionDocument,
            getRunDocumentByRevisionId,
            saveMetaDataString,
            getMetaDataString
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
