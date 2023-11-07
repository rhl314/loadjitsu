-- Your SQL goes here
CREATE TABLE RunDocumentFiles (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    saved_at DATETIME NOT NULL
);