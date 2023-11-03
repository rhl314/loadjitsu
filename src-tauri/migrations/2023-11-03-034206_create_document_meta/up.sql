CREATE TABLE DocumentMeta (
    id VARCHAR(512) NOT NULL PRIMARY KEY,
    key VARCHAR(512) NOT NULL,
    value_string TEXT,
    value_float REAL,
    value_integer INTEGER,
    value_datetime DATETIME
);

CREATE INDEX index_document_meta_key ON DocumentMeta (key);