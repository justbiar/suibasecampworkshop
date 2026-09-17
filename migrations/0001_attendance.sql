CREATE TABLE IF NOT EXISTS attendance (
  event_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, visitor_id)
);
