-- Your SQL goes here
CREATE TABLE Run (
    id VARCHAR(512) NOT NULL PRIMARY KEY,
    document_revision_id VARCHAR NOT NULL,
    pid VARCHAR,
    status VARCHAR NOT NULL,
    started_at DATETIME,
    completed_at DATETIME
);

