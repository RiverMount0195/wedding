CREATE TABLE rsvps (
  token      TEXT PRIMARY KEY REFERENCES guests(token),
  name       TEXT NOT NULL,
  attending  INTEGER NOT NULL CHECK (attending IN (0, 1)),
  guests     INTEGER NOT NULL CHECK (guests BETWEEN 0 AND 10),
  message    TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
