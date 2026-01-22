-- Add product_type and description columns to products table
-- product_type: 'single' (単体購入) | 'subscription' (サブスクリプション)
ALTER TABLE products ADD COLUMN product_type TEXT NOT NULL DEFAULT 'single';
ALTER TABLE products ADD COLUMN description TEXT;

-- Create index for subscription queries by site
CREATE INDEX IF NOT EXISTS idx_products_site_type ON products(site_id, product_type);

-- Product prices table for subscription pricing (monthly/yearly)
-- 1 product can have multiple prices (e.g., monthly and yearly billing)
CREATE TABLE IF NOT EXISTS product_prices (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  billing_period TEXT NOT NULL,  -- 'monthly' | 'yearly'
  price INTEGER NOT NULL,
  stripe_price_id TEXT NOT NULL,
  label TEXT,                    -- UI display label (e.g., '月額プラン')
  badge TEXT,                    -- Badge text (e.g., '2ヶ月分お得')
  created_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(product_id, billing_period)
);

CREATE INDEX IF NOT EXISTS idx_product_prices_product ON product_prices(product_id);
