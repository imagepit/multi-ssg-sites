#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-}"
HEAD="${2:-}"

if [ -z "$BASE" ] || [ -z "$HEAD" ]; then
  echo "usage: $(basename "$0") <base> <head>" >&2
  exit 1
fi

if ! git rev-parse --verify "$BASE" >/dev/null 2>&1; then
  BASE="$(git rev-parse HEAD~1 2>/dev/null || git rev-parse HEAD)"
fi

if ! git rev-parse --verify "$HEAD" >/dev/null 2>&1; then
  HEAD="$(git rev-parse HEAD)"
fi

changed=$(git diff --name-only "$BASE" "$HEAD")
if [ -z "$changed" ]; then
  echo "[]"
  exit 0
fi

use_rg=false
if command -v rg >/dev/null 2>&1; then
  use_rg=true
fi

force_all=false
if $use_rg; then
  if printf "%s\n" "$changed" | rg -q '^(theme|shared|scripts)/|^package\.json$|^pnpm-lock\.yaml$'; then
    force_all=true
  fi
else
  if printf "%s\n" "$changed" | grep -E -q '^(theme|shared|scripts)/|^package\.json$|^pnpm-lock\.yaml$'; then
    force_all=true
  fi
fi

if $force_all; then
  sites=$(git ls-tree -d --name-only "$HEAD" contents | sort -u)
else
  if $use_rg; then
    content_sites=$(printf "%s\n" "$changed" | rg '^contents/[^/]+/' || true)
    content_sites=$(printf "%s\n" "$content_sites" | awk -F/ '{print $2}')
    image_files=$(printf "%s\n" "$changed" | rg '^images/' || true)
  else
    content_sites=$(printf "%s\n" "$changed" | grep -E '^contents/[^/]+/' || true)
    content_sites=$(printf "%s\n" "$content_sites" | awk -F/ '{print $2}')
    image_files=$(printf "%s\n" "$changed" | grep -E '^images/' || true)
  fi

  image_sites=""
  if [ -n "$image_files" ]; then
    while IFS= read -r image; do
      [ -z "$image" ] && continue
      if $use_rg; then
        matches=$(rg -l --fixed-strings "$image" contents --glob '*.md' --glob '*.mdx' || true)
      else
        matches=$(grep -R -l -F -- "$image" contents --include '*.md' --include '*.mdx' || true)
      fi
      if [ -n "$matches" ]; then
        image_sites="${image_sites}"$'\n'"$(printf "%s\n" "$matches" | awk -F/ '{print $2}')"
      fi
    done <<< "$image_files"
  fi

  sites=$(printf "%s\n%s\n" "${content_sites:-}" "${image_sites:-}" | awk 'NF' | sort -u)
fi

if command -v jq >/dev/null 2>&1; then
  printf "%s\n" "$sites" | jq -R -s -c 'split("\n") | map(select(length>0))'
  exit 0
fi

if [ -z "$sites" ]; then
  echo "[]"
  exit 0
fi

json_items=$(printf "%s\n" "$sites" | awk 'NF' | sed 's/\\/\\\\/g; s/"/\\"/g' | paste -sd, -)
printf '["%s"]\n' "${json_items//,/\",\"}"
