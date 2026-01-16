#!/bin/bash
set -euo pipefail

# 設定
REMOTE_USER="root"
REMOTE_HOST="nextjs-app"  # ssh nextjs-app でアクセス可能
REMOTE_PATH="/opt/nextjs-app"
LOCAL_PATH="/Users/imagepit/Dropbox/imagepit/techdoc"

# ドキュメント(SSG)配布先（静的ホスティング想定）
DOCS_REMOTE_PATH="/var/www/docs-staging"

SITE_ID="${1:-}"
THEME_ID="${2:-${THEME_ID:-fumadocs}}"

if [ -n "${SITE_ID}" ]; then
  echo "🚀 Starting per-site docs deployment for: ${SITE_ID} (theme: ${THEME_ID})"

  if [ ! -d "$LOCAL_PATH/theme/${THEME_ID}" ]; then
    echo "❌ theme/${THEME_ID} not found under $LOCAL_PATH/theme" >&2
    exit 1
  fi
  cd "$LOCAL_PATH/theme/${THEME_ID}"

  echo "📦 Installing dependencies (pnpm) for fumadocs..."
  if ! pnpm install --frozen-lockfile; then
    echo "ℹ️  Lockfileが古いため、--no-frozen-lockfile で再試行します"
    pnpm install --no-frozen-lockfile
  fi

  echo "🏗️  Building static export for ${SITE_ID}..."
  # サブドメイン配信のため basePath は付与しない。SSG用の静的検索を有効化
  export SSG_EXPORT=1
  export SITE_ID="${SITE_ID}"
  export NEXT_PUBLIC_SEARCH_STATIC=1
  export NEXT_PUBLIC_SITE_ID="${SITE_ID}"
  pnpm build

  echo "📡 Syncing static site to server..."
  rsync -avz --progress --delete \
    out/ "${REMOTE_USER}@${REMOTE_HOST}:${DOCS_REMOTE_PATH}/${SITE_ID}/"

  echo "✅ Docs deployment for ${SITE_ID} completed!"
  exit 0
fi

echo "🚀 Starting full application deployment..."

# 1. ローカルビルド（アプリ全体）
echo "📦 Building application locally..."
cd "$LOCAL_PATH"
echo "📦 Installing dependencies (pnpm)..."
if ! pnpm install --frozen-lockfile; then
  echo "ℹ️  Lockfileが古いため、--no-frozen-lockfile で再試行します"
  pnpm install --no-frozen-lockfile
fi

# 1.1 全サイトの静的検索インデックスを生成（更新のあったサイトのみ再生成）
echo "🔎 Building static search indexes..."
node scripts/build-search-index.mjs --all --basePattern "/" --outDir public/search-index || {
  echo "⚠️  Search index build failed, continuing without indexes"
}

# 1.2 Next.js ビルド
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. ファイル同期（除外設定）
echo "📡 Syncing files to server..."
rsync -avz --progress --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next/cache' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env.production' \
    --exclude='*.log' \
    --exclude='tmp/' \
    --exclude='.DS_Store' \
    --exclude='pm2.config.js' \
    --exclude='logs/' \
    --exclude='/var/log/nextjs-app/' \
    "$LOCAL_PATH/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
    echo "❌ Rsync failed!"
    exit 1
fi

# 3. リモートサーバーでの処理
echo "🔄 Installing dependencies and restarting application..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
cd /opt/nextjs-app

# ecosystem.config.jsが存在しない場合は作成
if [ ! -f "ecosystem.config.js" ]; then
    echo "📝 Creating ecosystem.config.js..."
    cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'pnpm',
    args: 'start',
    cwd: '/opt/nextjs-app',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '/opt/nextjs-app/.env.production',
    error_file: '/var/log/nextjs-app/err.log',
    out_file: '/var/log/nextjs-app/out.log',
    log_file: '/var/log/nextjs-app/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
}
EOFPM2
fi

# 依存関係インストール
pnpm install --frozen-lockfile --production

# PM2でアプリケーション管理
if pm2 list | grep -q nextjs-app; then
    echo "♻️  Restarting existing application..."
    pm2 restart nextjs-app
else
    echo "🆕 Starting new application..."
    pm2 start ecosystem.config.js
fi

# PM2設定を保存
pm2 save
pm2 startup
EOF

if [ $? -ne 0 ]; then
    echo "❌ Remote deployment failed!"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🔍 Check application status: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 status'"
echo "📊 View logs: ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs nextjs-app'"
