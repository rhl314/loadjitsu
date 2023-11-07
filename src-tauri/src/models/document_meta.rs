pub struct DocumentMeta {
    pub id: String,
    pub key: String,
    pub value_string: Option<String>,
    pub value_float: Option<f32>,
    pub value_integer: Option<i32>,
    pub value_datetime: Option<String>, // This requires the chrono crate
}
