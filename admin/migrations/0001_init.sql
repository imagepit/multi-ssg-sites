-- Core tables for multi-site management
CREATE TABLE IF NOT EXISTS sites (
  site_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  theme_id TEXT,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT NOT NULL,
  path TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  tags TEXT,
  priority INTEGER,
  updated_at TEXT NOT NULL,
  UNIQUE(site_id, path)
);
