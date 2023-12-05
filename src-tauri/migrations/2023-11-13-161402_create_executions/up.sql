-- Your SQL goes here
CREATE TABLE Executions (
    unique_id TEXT PRIMARY KEY,
    execution_document_id TEXT NOT NULL,
    status TEXT,
    timeMs UNSIGNED BIG INT,
    latencyMs UNSIGNED BIG INT,
    stepUniqueId TEXT,
    error TEXT,
    statusCode UNSIGNED BIG INT,
    created_at DATETIME NOT NULL
);

CREATE INDEX index_status ON Executions(status);
CREATE INDEX index_timeMs ON Executions(timeMs);
CREATE INDEX index_latencyMs ON Executions(latencyMs);
CREATE INDEX index_stepUniqueId ON Executions(stepUniqueId);
CREATE INDEX index_error ON Executions(error);
CREATE INDEX index_statusCode ON Executions(statusCode);
