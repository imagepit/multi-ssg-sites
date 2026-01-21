-- Add stripe_price_id column to products table for Stripe integration
ALTER TABLE products ADD COLUMN stripe_price_id TEXT;
