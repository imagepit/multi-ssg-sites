#!/usr/bin/env bash
set -euo pipefail

# Scaffold a new theme by copying an existing theme directory (default: fumadocs)
# Usage: scripts/scaffold-theme.sh <new-theme-id> [--from <base-theme-id>]

if [ $# -lt 1 ]; then
  echo "Usage: $0 <new-theme-id> [--from <base-theme-id>]" >&2
  exit 1
fi

NEW_THEME="$1"; shift || true
BASE_THEME="fumadocs"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from)
      BASE_THEME="$2"; shift 2 ;;
    *)
      echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
SRC_DIR="${ROOT_DIR}/theme/${BASE_THEME}"
DST_DIR="${ROOT_DIR}/theme/${NEW_THEME}"

if [ ! -d "${SRC_DIR}" ]; then
  echo "❌ Base theme not found: theme/${BASE_THEME}" >&2
  exit 1
fi

if [ -d "${DST_DIR}" ]; then
  echo "❌ Destination exists: theme/${NEW_THEME}" >&2
  exit 1
fi

echo "📁 Scaffolding theme '${NEW_THEME}' from '${BASE_THEME}'"

mkdir -p "${DST_DIR}"
rsync -a \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'out' \
  --exclude '.turbo' \
  --exclude 'public/nextImageExportOptimizer' \
  --exclude '.DS_Store' \
  --exclude '.git' \
  "${SRC_DIR}/" "${DST_DIR}/"

# Update package name if present
if [ -f "${DST_DIR}/package.json" ]; then
  # Keep it simple without jq dependency
  tmpfile="${DST_DIR}/package.json.tmp"
  awk 'BEGIN{FS=OFS=":"} /^  \"name\"/ {$2=" \"'"${NEW_THEME}"'\","} {print}' "${DST_DIR}/package.json" > "$tmpfile" || true
  mv "$tmpfile" "${DST_DIR}/package.json"
fi

echo "✅ Created theme/${NEW_THEME}"
echo "Next steps:"
echo "  1) ./dev.sh <site-id> ${NEW_THEME}"
echo "  2) Edit theme/${NEW_THEME}/README.md and source to customize UI"
echo "  3) ./deploy.sh <site-id> ${NEW_THEME}"

