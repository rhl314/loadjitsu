// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[macro_use]
extern crate diesel;

use std::env::current_exe;

use clap::Parser;
use file_service::file_service::FileService;
use load_test_service::load_test_service::LoadTestService;
mod api_service;
mod database_service;
mod document_service;
mod file_service;
mod load_test_service;
mod models;
mod protos;
mod schema;
mod types;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct CLIArgs {
    #[arg(short, long, default_value_t = String::from("GUI"))]
    mode: String,
    #[arg(short, long, default_value_t = String::from(""))]
    run_document_path: String,
    #[arg(short, long, default_value_t = String::from(""))]
    document_revision_id: String,
    #[arg(short, long, default_value_t = String::from(""))]
    unique_id: String,
}

mod gui;
#[tokio::main]
async fn main() {
    let args = CLIArgs::parse();
    let mut v: Vec<types::common::IRunFile> = Vec::new();
    let current_exe_signature = FileService::current_exe_signature().unwrap();
    println!("current_exe_signature: {}", current_exe_signature);
    if args.mode == "GUI" {
        gui::spawnUi(current_exe_signature)
    } else if args.mode == "CLI" {
        if args.run_document_path.len() == 0 {
            println!("Please provide run_document_path");
            std::process::exit(1);
        }
        if args.document_revision_id.len() == 0 {
            println!("Please provide document_revision_id");
            std::process::exit(1);
        }

        if args.unique_id.len() == 0 {
            println!("Please provide run_unique_id");
            std::process::exit(1);
        }
        let ranOrError = LoadTestService::run_load_test_from_cli_args(
            args.run_document_path,
            args.document_revision_id,
            args.unique_id,
        )
        .await;
        match ranOrError {
            Ok(ran) => {
                println!("ran: {:?}", ran);
            }
            Err(error) => {
                println!("error: {:?}", error);
                std::process::exit(1);
            }
        }
    } else {
        println!("Invalid mode. Please use CLI or GUI");
        std::process::exit(1);
    }
}
