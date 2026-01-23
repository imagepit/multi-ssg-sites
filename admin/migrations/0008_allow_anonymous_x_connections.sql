-- Migration: Allow anonymous users to connect X account
-- Remove FOREIGN KEY constraint on user_id to allow anonymous users (user_id = 'anonymous')
-- This is needed for X promotion feature to work without requiring user authentication

-- SQLite does not support ALTER TABLE DROP CONSTRAINT, so we need to recreate the table

-- Step 1: Create new table without foreign key constraint
CREATE TABLE x_user_connections_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  x_user_id TEXT NOT NULL UNIQUE,
  x_username TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  token_expires_at INTEGER NOT NULL,
  connected_at TEXT NOT NULL
);

-- Step 2: Copy data from old table
INSERT INTO x_user_connections_new
SELECT id, user_id, x_user_id, x_username, access_token_encrypted, refresh_token_encrypted, token_expires_at, connected_at
FROM x_user_connections;

-- Step 3: Drop old table
DROP TABLE x_user_connections;

-- Step 4: Rename new table
ALTER TABLE x_user_connections_new RENAME TO x_user_connections;

-- Step 5: Recreate index
CREATE INDEX idx_x_user_connections_user ON x_user_connections(user_id);
