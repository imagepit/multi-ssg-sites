-- Migration: Remove FOREIGN KEY constraint from x_promotion_campaigns
-- Allows creating campaigns without products table entry

-- Create new table without FOREIGN KEY constraint
CREATE TABLE x_promotion_campaigns_new (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  tweet_id TEXT NOT NULL,
  tweet_url TEXT,
  label TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at INTEGER,
  ends_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(product_id, site_id, slug)
);

-- Copy data from old table
INSERT INTO x_promotion_campaigns_new
SELECT * FROM x_promotion_campaigns;

-- Drop old table
DROP TABLE x_promotion_campaigns;

-- Rename new table
ALTER TABLE x_promotion_campaigns_new RENAME TO x_promotion_campaigns;

-- Recreate indexes
CREATE INDEX idx_x_promotion_campaigns_product ON x_promotion_campaigns(product_id, site_id);
CREATE INDEX idx_x_promotion_campaigns_status ON x_promotion_campaigns(status);
