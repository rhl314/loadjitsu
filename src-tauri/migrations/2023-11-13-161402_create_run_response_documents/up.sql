-- Your SQL goes here
CREATE TABLE RunResponseDocuments (
    unique_id TEXT PRIMARY KEY,
    status TEXT,
    timeMs UNSIGNED BIG INT,
    latencyMs UNSIGNED BIG INT,
    stepUniqueId TEXT,
    error TEXT,
    statusCode UNSIGNED BIG INT
);

CREATE INDEX index_status ON RunResponseDocuments(status);
CREATE INDEX index_timeMs ON RunResponseDocuments(timeMs);
CREATE INDEX index_latencyMs ON RunResponseDocuments(latencyMs);
CREATE INDEX index_stepUniqueId ON RunResponseDocuments(stepUniqueId);
CREATE INDEX index_error ON RunResponseDocuments(error);
CREATE INDEX index_statusCode ON RunResponseDocuments(statusCode);
