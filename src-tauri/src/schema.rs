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
    ExecutionDocuments (id) {
        id -> Text,
        document_revision_id -> Text,
        pid -> Nullable<Text>,
        status -> Text,
        started_at -> Nullable<Timestamp>,
        completed_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    Executions (unique_id) {
        unique_id -> Nullable<Text>,
        execution_document_id -> Text,
        status -> Nullable<Text>,
        timeMs -> Nullable<BigInt>,
        latencyMs -> Nullable<BigInt>,
        stepUniqueId -> Nullable<Text>,
        error -> Nullable<Text>,
        statusCode -> Nullable<BigInt>,
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
    ExecutionDocuments,
    Executions,
    RunDocumentFiles,
);
