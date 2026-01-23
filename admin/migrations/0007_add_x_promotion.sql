-- Migration: Add X promotion tables for content unlock via X repost
-- Issue: #2185 X投稿（リポスト）によるコンテンツ解放機能

-- X連携ユーザー
CREATE TABLE x_user_connections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  x_user_id TEXT NOT NULL UNIQUE,
  x_username TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  token_expires_at INTEGER NOT NULL,
  connected_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- プロモーションキャンペーン（ビルド時に自動同期）
CREATE TABLE x_promotion_campaigns (
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
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(product_id, site_id, slug)
);

-- リポスト検証記録
CREATE TABLE x_promotion_redemptions (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  x_user_id TEXT NOT NULL,
  repost_id TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  entitlement_id TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES x_promotion_campaigns(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (entitlement_id) REFERENCES entitlements(id)
);

-- インデックス
CREATE INDEX idx_x_user_connections_user ON x_user_connections(user_id);
CREATE INDEX idx_x_promotion_campaigns_product ON x_promotion_campaigns(product_id, site_id);
CREATE INDEX idx_x_promotion_campaigns_status ON x_promotion_campaigns(status);
CREATE INDEX idx_x_promotion_redemptions_user ON x_promotion_redemptions(user_id, campaign_id);
CREATE INDEX idx_x_promotion_redemptions_campaign ON x_promotion_redemptions(campaign_id);
