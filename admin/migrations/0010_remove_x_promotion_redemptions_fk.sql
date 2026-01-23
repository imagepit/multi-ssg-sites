-- Migration: Remove FOREIGN KEY constraints from x_promotion_redemptions and entitlements
-- Allows creating records for anonymous users

-- Disable foreign key checks temporarily
PRAGMA foreign_keys = OFF;

-- Drop existing x_promotion_redemptions table
DROP TABLE IF EXISTS x_promotion_redemptions;

-- Recreate x_promotion_redemptions table without user_id and entitlement_id FOREIGN KEY constraints
CREATE TABLE x_promotion_redemptions (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  x_user_id TEXT NOT NULL,
  repost_id TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  entitlement_id TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES x_promotion_campaigns(id)
);

-- Recreate indexes for x_promotion_redemptions
CREATE INDEX idx_x_promotion_redemptions_user ON x_promotion_redemptions(user_id, campaign_id);
CREATE INDEX idx_x_promotion_redemptions_campaign ON x_promotion_redemptions(campaign_id);

-- Drop existing entitlements table indexes
DROP INDEX IF EXISTS idx_entitlements_user_id;
DROP INDEX IF EXISTS idx_entitlements_product_id;
DROP INDEX IF EXISTS idx_entitlements_site_id;

-- Drop existing entitlements table
DROP TABLE IF EXISTS entitlements;

-- Recreate entitlements table without user_id FOREIGN KEY constraint
CREATE TABLE entitlements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  granted_by TEXT NOT NULL,
  granted_at TEXT NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Recreate indexes for entitlements
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_product_id ON entitlements(product_id);
CREATE INDEX idx_entitlements_site_id ON entitlements(site_id);

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;
