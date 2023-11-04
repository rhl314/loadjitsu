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

impl DocumentMeta {
    pub fn insertOrUpdateString(
        conn: &SqliteConnection,
        key: &str,
        value: &str,
    ) -> diesel::QueryResult<Self> {
        use crate::schema::document_meta::dsl::*;
        use diesel::dsl::*;

        match document_meta
            .filter(key.eq(key))
            .first::<DocumentMeta>(conn)
        {
            Ok(mut existing_record) => {
                // Record exists, so update it.
                existing_record.value_string = Some(value.to_string());
                update(document_meta.find(existing_record.id))
                    .set(&existing_record)
                    .execute(conn)?;
                Ok(existing_record)
            }
            Err(diesel::NotFound) => {
                // Record does not exist, so create it.
                let new_id = Uuid::new_v4().to_string();
                let new_record = DocumentMeta {
                    id: new_id,
                    key: key.to_string(),
                    value_string: Some(value.to_string()),
                    value_float: None,
                    value_integer: None,
                    value_datetime: None,
                };
                insert_into(document_meta)
                    .values(&new_record)
                    .execute(conn)?;
                Ok(new_record)
            }
            Err(e) => Err(e),
        }
    }
}
