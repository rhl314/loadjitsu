#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ValidationError {
    #[prost(string, tag = "1")]
    pub field: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub message: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ApiBodyFormData {
    #[prost(string, tag = "1")]
    pub key: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub value: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub description: ::prost::alloc::string::String,
    #[prost(bool, tag = "4")]
    pub active: bool,
    #[prost(bool, tag = "5")]
    pub deleted: bool,
    #[prost(string, tag = "6")]
    pub unique_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "7")]
    pub validation_errors: ::prost::alloc::vec::Vec<ValidationError>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ApiBody {
    #[prost(enumeration = "EnumApiBodyType", tag = "1")]
    pub r#type: i32,
    #[prost(string, tag = "2")]
    pub content_type: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub data: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "4")]
    pub form_data: ::prost::alloc::vec::Vec<ApiBodyFormData>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ApiHeader {
    #[prost(string, tag = "1")]
    pub key: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub value: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub description: ::prost::alloc::string::String,
    #[prost(bool, tag = "4")]
    pub active: bool,
    #[prost(bool, tag = "5")]
    pub deleted: bool,
    #[prost(string, tag = "6")]
    pub unique_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "7")]
    pub validation_errors: ::prost::alloc::vec::Vec<ValidationError>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct HttpAuthBasic {
    #[prost(string, tag = "1")]
    pub username: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub password: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub validation_errors: ::prost::alloc::vec::Vec<ValidationError>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ApiStep {
    /// Unique ID string
    #[prost(string, tag = "1")]
    pub unique_id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub endpoint: ::prost::alloc::string::String,
    #[prost(enumeration = "HttpAction", tag = "3")]
    pub action: i32,
    #[prost(int32, tag = "4")]
    pub timeout_in_ms: i32,
    #[prost(message, optional, tag = "5")]
    pub body: ::core::option::Option<ApiBody>,
    #[prost(message, repeated, tag = "6")]
    pub headers: ::prost::alloc::vec::Vec<ApiHeader>,
    #[prost(enumeration = "HttpAuthType", tag = "7")]
    pub auth_type: i32,
    #[prost(message, optional, tag = "8")]
    pub auth_basic: ::core::option::Option<HttpAuthBasic>,
    #[prost(message, repeated, tag = "9")]
    pub validation_errors: ::prost::alloc::vec::Vec<ValidationError>,
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum HttpAction {
    Get = 0,
    Post = 1,
    Put = 2,
    Patch = 3,
    Delete = 4,
    Head = 5,
}
impl HttpAction {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            HttpAction::Get => "GET",
            HttpAction::Post => "POST",
            HttpAction::Put => "PUT",
            HttpAction::Patch => "PATCH",
            HttpAction::Delete => "DELETE",
            HttpAction::Head => "HEAD",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "GET" => Some(Self::Get),
            "POST" => Some(Self::Post),
            "PUT" => Some(Self::Put),
            "PATCH" => Some(Self::Patch),
            "DELETE" => Some(Self::Delete),
            "HEAD" => Some(Self::Head),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum EnumApiBodyType {
    Empty = 0,
    FormData = 1,
    XUrlFormEncoded = 2,
    Text = 3,
    Json = 4,
    Html = 5,
    Xml = 6,
}
impl EnumApiBodyType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            EnumApiBodyType::Empty => "EMPTY",
            EnumApiBodyType::FormData => "FORM_DATA",
            EnumApiBodyType::XUrlFormEncoded => "X_URL_FORM_ENCODED",
            EnumApiBodyType::Text => "TEXT",
            EnumApiBodyType::Json => "JSON",
            EnumApiBodyType::Html => "HTML",
            EnumApiBodyType::Xml => "XML",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "EMPTY" => Some(Self::Empty),
            "FORM_DATA" => Some(Self::FormData),
            "X_URL_FORM_ENCODED" => Some(Self::XUrlFormEncoded),
            "TEXT" => Some(Self::Text),
            "JSON" => Some(Self::Json),
            "HTML" => Some(Self::Html),
            "XML" => Some(Self::Xml),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum HttpAuthType {
    NoneAuth = 0,
    BasicAuth = 1,
}
impl HttpAuthType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            HttpAuthType::NoneAuth => "NONE_AUTH",
            HttpAuthType::BasicAuth => "BASIC_AUTH",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "NONE_AUTH" => Some(Self::NoneAuth),
            "BASIC_AUTH" => Some(Self::BasicAuth),
            _ => None,
        }
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RunConfiguration {
    #[prost(int32, tag = "1")]
    pub rps: i32,
    #[prost(int32, tag = "2")]
    pub duration_in_seconds: i32,
    #[prost(enumeration = "RunShape", tag = "3")]
    pub shape: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RunDocument {
    /// Unique ID string
    #[prost(string, tag = "1")]
    pub unique_id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub title: ::prost::alloc::string::String,
    #[prost(enumeration = "RunType", tag = "3")]
    pub r#type: i32,
    #[prost(message, optional, tag = "4")]
    pub configuration: ::core::option::Option<RunConfiguration>,
    #[prost(message, repeated, tag = "21")]
    pub api_steps: ::prost::alloc::vec::Vec<ApiStep>,
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum RunType {
    None = 0,
    Api = 1,
    Website = 2,
    Redis = 3,
    Mysql = 4,
    Mongodb = 5,
    Postgres = 6,
    Neo4j = 7,
    Mssql = 8,
    Graphql = 9,
    Elasticsearch = 10,
    Websockets = 11,
}
impl RunType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            RunType::None => "NONE",
            RunType::Api => "API",
            RunType::Website => "WEBSITE",
            RunType::Redis => "REDIS",
            RunType::Mysql => "MYSQL",
            RunType::Mongodb => "MONGODB",
            RunType::Postgres => "POSTGRES",
            RunType::Neo4j => "NEO4J",
            RunType::Mssql => "MSSQL",
            RunType::Graphql => "GRAPHQL",
            RunType::Elasticsearch => "ELASTICSEARCH",
            RunType::Websockets => "WEBSOCKETS",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "NONE" => Some(Self::None),
            "API" => Some(Self::Api),
            "WEBSITE" => Some(Self::Website),
            "REDIS" => Some(Self::Redis),
            "MYSQL" => Some(Self::Mysql),
            "MONGODB" => Some(Self::Mongodb),
            "POSTGRES" => Some(Self::Postgres),
            "NEO4J" => Some(Self::Neo4j),
            "MSSQL" => Some(Self::Mssql),
            "GRAPHQL" => Some(Self::Graphql),
            "ELASTICSEARCH" => Some(Self::Elasticsearch),
            "WEBSOCKETS" => Some(Self::Websockets),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum RunShape {
    Constant = 0,
    Shaped = 1,
    Ramp = 2,
}
impl RunShape {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            RunShape::Constant => "CONSTANT",
            RunShape::Shaped => "SHAPED",
            RunShape::Ramp => "RAMP",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "CONSTANT" => Some(Self::Constant),
            "SHAPED" => Some(Self::Shaped),
            "RAMP" => Some(Self::Ramp),
            _ => None,
        }
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RunLog {
    #[prost(int64, tag = "1")]
    pub timestamp: i64,
    #[prost(string, repeated, tag = "2")]
    pub chunks: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RunResponse {
    #[prost(string, tag = "1")]
    pub unique_id: ::prost::alloc::string::String,
    #[prost(bool, tag = "2")]
    pub has_logs: bool,
    #[prost(message, repeated, tag = "3")]
    pub logs: ::prost::alloc::vec::Vec<RunLog>,
    #[prost(enumeration = "RunStatus", tag = "4")]
    pub status: i32,
    #[prost(string, tag = "5")]
    pub description: ::prost::alloc::string::String,
    #[prost(uint64, tag = "6")]
    pub time: u64,
    #[prost(uint64, tag = "7")]
    pub latency: u64,
    #[prost(string, tag = "8")]
    pub step_unique_id: ::prost::alloc::string::String,
    #[prost(string, tag = "11")]
    pub error: ::prost::alloc::string::String,
    #[prost(uint64, tag = "12")]
    pub status_code: u64,
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum RunStatus {
    Success = 0,
    Error = 1,
    Timeout = 2,
    Exception = 3,
    Invalid = 4,
}
impl RunStatus {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            RunStatus::Success => "SUCCESS",
            RunStatus::Error => "ERROR",
            RunStatus::Timeout => "TIMEOUT",
            RunStatus::Exception => "EXCEPTION",
            RunStatus::Invalid => "INVALID",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "SUCCESS" => Some(Self::Success),
            "ERROR" => Some(Self::Error),
            "TIMEOUT" => Some(Self::Timeout),
            "EXCEPTION" => Some(Self::Exception),
            "INVALID" => Some(Self::Invalid),
            _ => None,
        }
    }
}
