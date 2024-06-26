use base64;
use base64::Engine as _;
use prost::Message;
use reqwest::header::{HeaderMap, HeaderValue};
use sqlx::SqlitePool;
use std::time::Duration;
use std::{io::Cursor, time::Instant};
use tauri::api;
use uuid::Uuid;

use crate::database_service::database_service::DatabaseService;
use crate::file_service::app_service::AppService;
use crate::models::execution::{self, ExecutionCountByStatusAndRunSecond, ExecutionResults};
use crate::models::{DocumentMeta, Execution, ExecutionDocument};
use crate::protos::ipc::{RunConfiguration, RunDocument, RunShape, RunType};
use crate::protos::{
    self,
    ipc::{ApiBody, ApiStep, EnumApiBodyType, HttpAction, HttpAuthBasic, RunResponse},
};

pub struct ApiService;

impl ApiService {
    pub fn deserialize_api_step(encoded: &str) -> Result<ApiStep, Box<dyn std::error::Error>> {
        // Decode the Base64 encoded string into bytes
        let decoded_bytes = base64::decode(encoded)?;

        // Create a Cursor over the decoded bytes
        let mut cursor = Cursor::new(decoded_bytes);

        // Use prost's decode method to try and parse the ApiStep
        let api_step = ApiStep::decode(&mut cursor)?;

        Ok(api_step)
    }
    pub fn serialize_run_response(
        run_response: &RunResponse,
    ) -> Result<String, Box<dyn std::error::Error>> {
        // Convert the ApiStep object into bytes
        let mut bytes = Vec::new();
        run_response.encode(&mut bytes)?;

        // Encode the bytes into a Base64 string
        let encoded_string = base64::encode(&bytes);

        Ok(encoded_string)
    }

    pub fn serialize_api_step(api_step: &ApiStep) -> Result<String, Box<dyn std::error::Error>> {
        // Convert the ApiStep object into bytes
        let mut bytes = Vec::new();
        api_step.encode(&mut bytes)?;

        // Encode the bytes into a Base64 string
        let encoded_string = base64::encode(&bytes);

        Ok(encoded_string)
    }

    pub fn serialize_run_document(run_document: &RunDocument) -> anyhow::Result<String> {
        // Convert the ApiStep object into bytes
        let mut bytes = Vec::new();
        run_document.encode(&mut bytes)?;

        // Encode the bytes into a Base64 string
        let encoded_string = base64::encode(&bytes);

        Ok(encoded_string)
    }

    pub fn deserialize_run_document(encoded: &str) -> anyhow::Result<RunDocument> {
        // Decode the Base64 encoded string into bytes
        let decoded_bytes = base64::decode(encoded)?;

        // Create a Cursor over the decoded bytes
        let mut cursor = Cursor::new(decoded_bytes);

        // Use prost's decode method to try and parse the ApiStep
        let run_document = RunDocument::decode(&mut cursor)?;

        Ok(run_document)
    }

    pub fn generateBlankApiBody() -> ApiBody {
        ApiBody {
            r#type: EnumApiBodyType::Empty as i32, // Setting type as Empty
            content_type: "".to_string(),          // Empty content type
            data: "".to_string(),                  // Empty data
            form_data: Vec::new(),                 // Empty form data
        }
    }

    pub fn generateBlankBasicAuth() -> HttpAuthBasic {
        HttpAuthBasic {
            username: "".to_string(),
            password: "".to_string(),
            validation_errors: Vec::new(),
        }
    }

    pub fn generateRunConfiguration() -> RunConfiguration {
        RunConfiguration {
            rps: 30,
            duration_in_seconds: 30,
            shape: RunShape::Constant.into(),
        }
    }

    pub fn generateNewRunDocument() -> RunDocument {
        RunDocument {
            unique_id: Uuid::new_v4().to_string(),
            title: String::from("Untitled test"),
            r#type: RunType::Api.into(),
            configuration: Some(self::ApiService::generateRunConfiguration()),
            api_steps: Vec::new(),
        }
    }
    pub async fn save_global_meta_string(key: &str, value: &str) -> anyhow::Result<()> {
        let path = AppService::get_metadata_file_path()?;
        let pool = DatabaseService::connection(&path).await?;
        let saved = DocumentMeta::save_string(&pool, key, value).await?;
        return Ok(saved);
    }

    pub async fn get_global_meta_string(key: &str) -> anyhow::Result<String> {
        let path = AppService::get_metadata_file_path()?;
        let pool = DatabaseService::connection(&path).await?;
        let value = DocumentMeta::get_string(&pool, key).await?;
        return Ok(value);
    }

    pub async fn save_document_meta_string(
        run_document_path: &str,
        key: &str,
        value: &str,
    ) -> anyhow::Result<()> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let saved = DocumentMeta::save_string(&pool, key, value).await?;
        return Ok(saved);
    }

    pub async fn get_document_meta_string(
        run_document_path: &str,
        key: &str,
    ) -> anyhow::Result<String> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let value = DocumentMeta::get_string(&pool, key).await?;
        return Ok(value);
    }

    pub async fn get_execution_results(
        execution_document_id: &str,
        run_document_path: &str,
    ) -> anyhow::Result<ExecutionResults> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let execution_count_by_status_and_run_seconds =
            Execution::get_execution_count_by_status_and_run_second(execution_document_id, &pool)
                .await?;
        let execution_count_by_status =
            Execution::get_execution_count_by_status(execution_document_id, &pool).await?;
        let execution_summary =
            Execution::get_execution_summary(execution_document_id, &pool).await?;

        Ok({
            ExecutionResults {
                execution_count_by_status_and_run_second: execution_count_by_status_and_run_seconds,
                execution_count_by_status: execution_count_by_status,
                execution_summary: execution_summary,
            }
        })
    }

    pub async fn get_executions(
        execution_document_id: &str,
        run_document_path: &str,
    ) -> anyhow::Result<Vec<Execution>> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let executions = Execution::get_executions(execution_document_id, &pool).await?;
        Ok(executions)
    }

    pub async fn get_execution_document(
        execution_document_id: &str,
        run_document_path: &str,
    ) -> anyhow::Result<ExecutionDocument> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let execution_document =
            Execution::get_execution_document(execution_document_id, &pool).await?;
        Ok(execution_document)
    }

    pub async fn abort_execution(
        execution_document_id: &str,
        run_document_path: &str,
    ) -> anyhow::Result<()> {
        let decoded_document_path = AppService::decode_path(run_document_path)?;
        let pool = DatabaseService::connection(decoded_document_path.as_str()).await?;
        let execution_document =
            Execution::get_execution_document(execution_document_id, &pool).await?;
        ExecutionDocument::update_execution_document_status(
            &pool,
            &execution_document,
            "REQUESTED_ABORT",
        )
        .await?;
        Ok(())
    }

    pub async fn run_and_record_response(
        api_step: &ApiStep,
        run_unique_id: &str,
        run_second: i32,
        pool: &SqlitePool,
    ) {
        let created_at = chrono::Utc::now().to_rfc3339();
        let ran = ApiService::run(api_step).await.unwrap();
        let run_response_document = Execution {
            unique_id: String::from(&ran.unique_id),
            execution_document_id: run_unique_id.to_string(),
            status: ran.status().as_str_name().to_string(),
            timeMs: ran.time as i64,
            latencyMs: ran.latency as i64,
            stepUniqueId: ran.step_unique_id,
            error: ran.error,
            statusCode: ran.status_code as i64,
            created_at: created_at,
            completed_at: chrono::Utc::now().to_rfc3339(),
            run_second: run_second,
        };
        dbg!(&run_response_document);
        Execution::insert(run_response_document, pool)
            .await
            .unwrap();
    }

    pub async fn run(api_step: &ApiStep) -> Result<RunResponse, Box<dyn std::error::Error>> {
        let client = reqwest::Client::new();

        // Convert the HttpAction enum to a reqwest::Method
        let method = match api_step.action() {
            HttpAction::Get => reqwest::Method::GET,
            HttpAction::Post => reqwest::Method::POST,
            HttpAction::Put => reqwest::Method::PUT,
            HttpAction::Delete => reqwest::Method::DELETE,
            HttpAction::Patch => reqwest::Method::PATCH,
            HttpAction::Head => reqwest::Method::HEAD,
            _ => {
                return Err(Box::new(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    "Invalid HTTP action",
                )))
            }
        };

        // Convert ApiStep headers to reqwest HeaderMap
        let mut headers = HeaderMap::new();
        for header in &api_step.headers {
            let header_name = reqwest::header::HeaderName::from_bytes(header.key.as_bytes())?;
            let header_value = HeaderValue::from_str(&header.value)?;
            headers.insert(header_name, header_value);
        }

        // Construct the request
        let mut request_builder = client.request(method, &api_step.endpoint);

        // Add body if present
        if let Some(body) = &api_step.body {
            match body.r#type() {
                EnumApiBodyType::Empty => {}
                EnumApiBodyType::XUrlFormEncoded => {
                    let mut params = std::collections::HashMap::new();
                    for form_data in &body.form_data {
                        params.insert(form_data.key.clone(), form_data.value.clone());
                    }
                    request_builder = request_builder.form(&params);
                    headers.insert("Content-Type", "application/x-www-form-urlencoded".parse()?);
                }
                EnumApiBodyType::FormData => {
                    let mut form = reqwest::multipart::Form::new();
                    for form_data in &body.form_data {
                        form = form.text(form_data.key.clone(), form_data.value.clone());
                    }
                    request_builder = request_builder.multipart(form);
                }
                EnumApiBodyType::Json => {
                    let json: serde_json::Value = serde_json::from_str(&body.data)?;
                    request_builder = request_builder.json(&json);
                    headers.insert("Content-Type", "application/json".parse()?);
                }

                EnumApiBodyType::Xml => {
                    request_builder = request_builder.body(body.data.clone());
                    headers.insert("Content-Type", "application/xml".parse()?);
                }
                EnumApiBodyType::Html => {
                    request_builder = request_builder.body(body.data.clone());
                    headers.insert("Content-Type", "text/html".parse()?);
                }
                EnumApiBodyType::Text => {
                    request_builder = request_builder.body(body.data.clone());
                    headers.insert("Content-Type", "text/plain".parse()?);
                }
            }
        }

        request_builder = request_builder
            .headers(headers)
            .timeout(Duration::from_millis(api_step.timeout_in_ms as u64));

        if api_step.auth_type() == protos::ipc::HttpAuthType::BasicAuth {
            if let Some(auth_basic) = &api_step.auth_basic {
                request_builder = request_builder.basic_auth(
                    auth_basic.username.clone(),
                    Some(auth_basic.password.clone()),
                );
            }
        }

        let start = Instant::now();

        // Send the request
        let response_or_error = request_builder.send().await;
        let response_unique_id = uuid::Uuid::new_v4().to_string();
        let _statusCode = 0;
        let mut status = protos::ipc::RunStatus::Success;
        let mut error = String::from("");
        let mut responseSize = 0;
        let mut latency = api_step.timeout_in_ms as u64;
        let mut time = api_step.timeout_in_ms as u64;
        let mut status_code = 500;
        match response_or_error {
            Ok(response) => {
                latency = start.elapsed().as_millis() as u64;
                status_code = u64::from(response.status().as_u16());
                if status_code >= 400 || status_code < 200 {
                    status = protos::ipc::RunStatus::Error;
                }
                let responseBytesOrError = response.bytes().await;
                match responseBytesOrError {
                    Ok(responseBytes) => {
                        responseSize = responseBytes.len();
                        time = start.elapsed().as_millis() as u64;
                    }
                    Err(e) => {
                        status = protos::ipc::RunStatus::Exception;
                        error = e.to_string();
                    }
                }
            }
            Err(e) => {
                status = protos::ipc::RunStatus::Exception;
                error = e.to_string();
            }
        }

        if error.matches("timed out").count() > 0 {
            status = protos::ipc::RunStatus::Timeout;
            status_code = 504;
        }

        // Here, you'd typically convert the response into a RunResponse object
        // For simplicity, I'll just return a default RunResponse for now
        Ok(RunResponse {
            unique_id: response_unique_id,
            has_logs: false,
            logs: Vec::new(),
            status: status.into(),
            description: String::from(""),
            time: time,
            latency: latency,
            error: error,
            step_unique_id: String::from(api_step.unique_id.clone()),
            status_code,
        })
    }
}

#[cfg(test)]
mod tests {
    use uuid::{uuid, Uuid};

    use crate::{
        file_service::app_service::AppService,
        protos::ipc::{ApiStep, HttpAction, HttpAuthType, RunStatus},
    };

    use super::ApiService;

    #[test]
    fn it_should_correctly_serialize() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/get");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let object = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let serialised_or_error = self::ApiService::serialize_api_step(&object);
        assert!(serialised_or_error.is_ok());
        let serialised = serialised_or_error.unwrap();

        let deserialized_or_error = ApiService::deserialize_api_step(&serialised);
        assert!(deserialized_or_error.is_ok());
        let deserialised_object = deserialized_or_error.unwrap();
        assert_eq!(deserialised_object.unique_id, unique_id);
        assert_eq!(deserialised_object.action(), action);
        assert_eq!(deserialised_object.endpoint, endpoint);
        assert_eq!(deserialised_object.headers.len(), 0);
    }
    #[tokio::test]
    async fn it_should_correctly_send_get_request() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/get");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }
    #[tokio::test]
    async fn it_should_fail_with_exception_if_url_domain_is_incorrect() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from(format!("https://{unique_id}.com/get"));
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Exception);
    }
    #[tokio::test]
    async fn it_should_not_correctly_send_get_request_without_protocol() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("httpbin.org/get");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        println!("{}", response.error);
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Exception);
    }
    #[tokio::test]
    async fn it_should_handle_404() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/get-not-found");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Error);
        assert_eq!(response.status_code, 404);
    }
    #[tokio::test]
    async fn it_should_correctly_send_delete_request() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/delete");
        let action = HttpAction::Delete;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }

    #[tokio::test]
    async fn it_should_correctly_send_post_request() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/post");
        let action = HttpAction::Post;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }

    #[tokio::test]
    async fn it_should_correctly_send_patch_request() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/patch");
        let action = HttpAction::Patch;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }

    #[tokio::test]
    async fn it_should_correctly_send_put_request() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/put");
        let action = HttpAction::Put;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }

    #[tokio::test]
    async fn it_should_handle_401_if_auth_is_missing() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/basic-auth/user/passwd");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(ApiService::generateBlankBasicAuth()),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Error);
        assert_eq!(response.status_code, 401);
    }

    #[tokio::test]
    async fn it_should_handle_401_without_basic_auth() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/basic-auth/user/passwd");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let mut basic_auth = ApiService::generateBlankBasicAuth();
        basic_auth.username = String::from("user");
        basic_auth.password = String::from("passwd");
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::NoneAuth.into(),
            auth_basic: Some(basic_auth),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Error);
        assert_eq!(response.status_code, 401);
    }
    #[tokio::test]
    async fn it_should_basic_auth_correctly() {
        let unique_id = String::from(Uuid::new_v4());
        let endpoint = String::from("https://httpbin.org/basic-auth/user/passwd");
        let action = HttpAction::Get;
        let timeout_in_ms = 5000;
        let body = self::ApiService::generateBlankApiBody();
        let mut basic_auth = ApiService::generateBlankBasicAuth();
        basic_auth.username = String::from("user");
        basic_auth.password = String::from("passwd");
        let api_step = ApiStep {
            unique_id: unique_id.clone(),
            endpoint: endpoint.clone(),
            action: action.into(),
            timeout_in_ms,
            body: Some(body.clone()),
            headers: Vec::new(),
            auth_type: HttpAuthType::BasicAuth.into(),
            auth_basic: Some(basic_auth),
            validation_errors: Vec::new(),
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }
}
