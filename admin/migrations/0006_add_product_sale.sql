-- Migration: Add sale columns to products and product_prices tables
-- Issue: #2184 期間限定セール（割引価格）機能

-- products テーブルにセール関連カラムを追加
ALTER TABLE products ADD COLUMN sale_price INTEGER;
ALTER TABLE products ADD COLUMN sale_starts_at INTEGER;
ALTER TABLE products ADD COLUMN sale_ends_at INTEGER;
ALTER TABLE products ADD COLUMN sale_label TEXT DEFAULT 'セール中';

-- product_prices テーブルにセール関連カラムを追加
ALTER TABLE product_prices ADD COLUMN sale_price INTEGER;
ALTER TABLE product_prices ADD COLUMN sale_starts_at INTEGER;
ALTER TABLE product_prices ADD COLUMN sale_ends_at INTEGER;
ALTER TABLE product_prices ADD COLUMN sale_label TEXT DEFAULT 'セール中';
ALTER TABLE product_prices ADD COLUMN stripe_coupon_id TEXT;
