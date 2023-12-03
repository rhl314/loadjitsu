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
    Execution (id) {
        id -> Text,
        document_revision_id -> Text,
        pid -> Nullable<Text>,
        status -> Text,
        started_at -> Nullable<Timestamp>,
        completed_at -> Nullable<Timestamp>,
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

diesel::table! {
    RunResponseDocuments (unique_id) {
        unique_id -> Nullable<Text>,
        run_unique_id -> Text,
        status -> Nullable<Text>,
        timeMs -> Nullable<BigInt>,
        latencyMs -> Nullable<BigInt>,
        stepUniqueId -> Nullable<Text>,
        error -> Nullable<Text>,
        statusCode -> Nullable<BigInt>,
        created_at -> Timestamp,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    DocumentMeta,
    DocumentRevisions,
    Execution,
    RunDocumentFiles,
    RunResponseDocuments,
);
