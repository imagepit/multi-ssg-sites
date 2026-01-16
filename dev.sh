#!/usr/bin/env bash

# Quick dev runner for Fumadocs per site
# Usage: ./dev.sh [site-id] [theme-id]
# Example: ./dev.sh v0 fumadocs

set -euo pipefail

SITE_ID="${1:-v0}"
THEME_ID="${2:-${THEME_ID:-fumadocs}}"
PORT="${PORT:-4000}"

echo "▶️  Starting ${THEME_ID} dev for site: ${SITE_ID} on http://localhost:${PORT}"

if [ ! -d "theme/${THEME_ID}" ]; then
  echo "❌ theme/${THEME_ID} not found. Available: $(ls -1 theme 2>/dev/null || echo 'none')" >&2
  exit 1
fi

pushd "theme/${THEME_ID}" >/dev/null

# Run Next dev for fumadocs with SITE_ID
export SITE_ID THEME_ID

# Ensure deps (first run or after move)
if [ ! -d node_modules ] || [ ! -d node_modules/zod ]; then
  echo "📦 Installing dependencies (pnpm)..."
  pnpm install --no-frozen-lockfile
fi

# Clear caches to avoid stale assets between site switches
echo "🧹 Clearing Next.js caches..."
rm -rf .next .turbo node_modules/.cache 2>/dev/null || true

# Run Next dev for fumadocs with SITE_ID
export SITE_ID
exec pnpm dev -p "${PORT}"

popd >/dev/null
