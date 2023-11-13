-- Your SQL goes here

CREATE TABLE run_response_documents (
    unique_id TEXT PRIMARY KEY,
    status TEXT,
    timeMs UNSIGNED BIG INT,
    latencyMs UNSIGNED BIG INT,
    stepUniqueId TEXT,
    error TEXT,
    statusCode UNSIGNED BIG INT
);

CREATE INDEX index_status ON run_response_documents(status);
CREATE INDEX index_timeMs ON run_response_documents(timeMs);
CREATE INDEX index_latencyMs ON run_response_documents(latencyMs);
CREATE INDEX index_stepUniqueId ON run_response_documents(stepUniqueId);
CREATE INDEX index_error ON run_response_documents(error);
CREATE INDEX index_statusCode ON run_response_documents(statusCode);

