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
