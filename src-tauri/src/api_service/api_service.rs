use base64;
use prost::Message;
use reqwest::header::{HeaderMap, HeaderValue};
use std::{f64::consts::E, io::Cursor, time::Instant};

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
    pub fn serialize_api_step(api_step: &ApiStep) -> Result<String, Box<dyn std::error::Error>> {
        // Convert the ApiStep object into bytes
        let mut bytes = Vec::new();
        api_step.encode(&mut bytes)?;

        // Encode the bytes into a Base64 string
        let encoded_string = base64::encode(&bytes);

        Ok(encoded_string)
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
        }
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
            // ... add cases for other HTTP actions here ...
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

        request_builder = request_builder.headers(headers);

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
        let mut statusCode = 0;
        let mut status = protos::ipc::RunStatus::Success;
        let mut error = String::from("");
        let mut responseSize = 0;
        let mut latency = 0;
        let mut time = 0;
        let mut status_code = 200;
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

    use crate::protos::ipc::{ApiStep, HttpAction, HttpAuthType, RunStatus};

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
        };
        let response_or_error = ApiService::run(&api_step).await;
        assert!(response_or_error.is_ok());
        let response = response_or_error.unwrap();
        assert_eq!(response.step_unique_id, unique_id);
        assert_eq!(response.status(), RunStatus::Success);
        assert_eq!(response.status_code, 200);
    }
}
