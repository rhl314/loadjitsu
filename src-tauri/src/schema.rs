// @generated automatically by Diesel CLI.

diesel::table! {
    DocumentMeta (id) {
        id -> Text,
        key -> Text,
        value_string -> Nullable<Text>,
        value_float -> Nullable<Float>,
        value_integer -> Nullable<Integer>,
        value_datetime -> Nullable<Timestamp>,
    }
}

diesel::table! {
    DocumentRevisions (id) {
        id -> Nullable<Text>,
        value -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    RunDocumentFiles (id) {
        id -> Nullable<Text>,
        path -> Text,
        title -> Text,
        saved_at -> Timestamp,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    DocumentMeta,
    DocumentRevisions,
    RunDocumentFiles,
);
