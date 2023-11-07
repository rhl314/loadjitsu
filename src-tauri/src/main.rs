// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[macro_use]
extern crate diesel;

use clap::Parser;
mod api_service;
mod database_service;
mod document_service;
mod file_service;
mod models;
mod protos;
mod schema;
mod types;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct CLIArgs {
    /// Name of the person to greet
    #[arg(short, long, default_value_t = String::from("GUI"))]
    mode: String,
}

mod gui;

fn main() {
    let args = CLIArgs::parse();
    let mut v: Vec<types::common::IRunFile> = Vec::new();
    if args.mode == "GUI" {
        gui::spawnUi()
    } else {
        println!("Cli support coming soon");
    }
}
