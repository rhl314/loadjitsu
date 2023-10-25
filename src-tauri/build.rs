fn main() {
    tauri_build::build();
    prost_build::Config::new()
        .out_dir("src/protos")
        .compile_protos(
            &[
                "src/protos/api.proto",
                "src/protos/run_document.proto",
                "src/protos/run_response.proto",
            ],
            &["src/protos"],
        )
        .unwrap();
}
