// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust now!", name)
}

#[derive(Serialize, Deserialize)]
struct RunFile {
    path: String,
}
#[tauri::command]
fn getRecentRuns() -> Vec<RunFile> {
    let mut v: Vec<RunFile> = Vec::new();
    /*let file = RunFile {
        path: String::from("hello"),
    };
    v.push(file);*/
    v
}

pub fn spawnUi() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![getRecentRuns, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
