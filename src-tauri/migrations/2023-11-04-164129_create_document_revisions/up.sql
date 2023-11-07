-- Your SQL goes here
CREATE TABLE DocumentRevisions (
  id VARCHAR(512) PRIMARY KEY,
  value TEXT NOT NULL,
  created_at DATETIME NOT NULL
);