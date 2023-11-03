#[derive(Queryable, Insertable, AsChangeset, Identifiable, PartialEq, Debug)]
#[table_name = "DocumentMeta"]
pub struct DocumentMeta {
    pub id: String,
    pub key: String,
    pub value_string: Option<String>,
    pub value_float: Option<f64>,
    pub value_integer: Option<i32>,
    pub value_datetime: Option<chrono::NaiveDateTime>, // This requires the chrono crate
}
