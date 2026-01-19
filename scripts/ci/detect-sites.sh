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

if $use_rg; then
  content_sites=$(printf "%s\n" "$changed" | rg '^contents/[^/]+/' || true)
  content_sites=$(printf "%s\n" "$content_sites" | awk -F/ '{print $2}')
  image_files=$(printf "%s\n" "$changed" | rg '^images/' || true)
  theme_ids=$(printf "%s\n" "$changed" | rg '^theme/[^/]+/' || true)
  theme_ids=$(printf "%s\n" "$theme_ids" | awk -F/ '{print $2}' | sort -u)
else
  content_sites=$(printf "%s\n" "$changed" | grep -E '^contents/[^/]+/' || true)
  content_sites=$(printf "%s\n" "$content_sites" | awk -F/ '{print $2}')
  image_files=$(printf "%s\n" "$changed" | grep -E '^images/' || true)
  theme_ids=$(printf "%s\n" "$changed" | grep -E '^theme/[^/]+/' || true)
  theme_ids=$(printf "%s\n" "$theme_ids" | awk -F/ '{print $2}' | sort -u)
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

theme_sites=""
if [ -n "$theme_ids" ]; then
  while IFS= read -r theme; do
    [ -z "$theme" ] && continue
    for spec in contents/*/specs/spec.json; do
      [ -f "$spec" ] || continue
      site=$(basename "$(dirname "$(dirname "$spec")")")
      theme_id=$(node -e "const fs=require('fs');const p=process.argv[1];try{const spec=JSON.parse(fs.readFileSync(p,'utf8'));console.log(spec.theme_id||spec.themeId||'');}catch{console.log('');}" "$spec")
      if [ "$theme_id" = "$theme" ]; then
        theme_sites="${theme_sites}"$'\n'"$site"
      fi
    done
  done <<< "$theme_ids"
fi

sites=$(printf "%s\n%s\n%s\n" "${content_sites:-}" "${image_sites:-}" "${theme_sites:-}" | awk 'NF' | sort -u)

if $force_all && [ -z "$sites" ]; then
  sites=$(git ls-tree -d --name-only "$HEAD" contents/ | awk -F/ '{print $2}' | sort -u)
fi

filter_sites_with_contents() {
  while IFS= read -r site; do
    [ -z "$site" ] && continue
    if [ -d "contents/$site/contents" ]; then
      printf "%s\n" "$site"
    fi
  done
}

if [ -n "${sites:-}" ]; then
  sites=$(printf "%s\n" "$sites" | filter_sites_with_contents)
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
