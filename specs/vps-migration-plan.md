---
title: ConoHaVPSからCloudflare移行計画書
---

# ConoHaVPSからCloudflare移行計画書

## 概要

既存のConoHa VPSリソースを活用し、現在のNext.jsマルチサイト構成からSSG + APIゲートウェイ構成へ段階的に移行する計画書です。

### 移行の目的

- ビルド時間とサーバー起動時間の大幅短縮
- 既存VPSリソースの有効活用
- 初期投資を抑えた段階的改善
- 将来的なCloudflare移行への準備

### 現状と目標

| 項目       | 現状           | Phase 1目標    | 最終目標         |
| -------- | ------------ | ------------ | ------------ |
| ビルド時間    | 10-15分       | 3-5分         | 2-3分/サイト     |
| 初回ロード    | 30-60秒       | 5-10秒        | 1-2秒         |
| 月額コスト    | ¥1,000 (VPS) | ¥1,000 (VPS) | ¥1,500-2,500 |
| スケーラビリティ | 低            | 中            | 高            |

##  システム構成

### Phase 1: VPS単独構成（1-2週間）

```
[Cloudflare CDN]
       ↓
[ConoHa VPS]
  ├─ Nginx (リバースプロキシ + 静的配信)
  │   ├─ SSGサイト配信 (/var/www/sites/)
  │   └─ APIプロキシ (→ Next.js)
  ├─ Next.js (APIゲートウェイ)
  │   ├─ 認証API (/api/auth)
  │   ├─ 決済API (/api/stripe)
  │   └─ 管理画面 (/admin)
  └─ SQLite/PostgreSQL (データベース)
```

### 有料コンテンツ配信方針（重要）

- 有料本文はSSG生成物（静的HTML）に含めない。
- プレースホルダのみ配置し、本文はAPI経由で取得するか、暗号化チャンク＋短命署名URLで配信する。
- 画像/PDF/ZIP等のバイナリも必ず署名URLを介して提供し、直リンクでの横取りを防ぐ。

### Phase 2: ハイブリッド構成（1ヶ月後）

```
[Cloudflare CDN]
       ↓
[静的アセット]              [動的処理]
  ├─ R2/S3 (画像・CSS・JS)    │
  └────────────────────────→ [ConoHa VPS]
                               ├─ Nginx
                               ├─ Next.js API
                               └─ Database
```

### Phase 3: フル移行（3ヶ月後）

```
[Cloudflare CDN + Workers]
  ├─ R2 (全静的ファイル)
  ├─ Edge Workers (認証)
  └─ API Gateway → [最小構成VPS or Vercel]
```

## VPSディレクトリ構造

```bash
/home/ubuntu/
├── techdoc/
│   ├── apps/
│   │   ├── gateway/           # Next.js APIゲートウェイ
│   │   │   ├── .next/
│   │   │   ├── package.json
│   │   │   └── server.js
│   │   └── builder/           # SSGビルドスクリプト
│   │       ├── build-site.js
│   │       └── deploy.sh
│   ├── sites/                 # SSGビルド出力
│   │   ├── claude-code/
│   │   │   └── out/
│   │   ├── v0/
│   │   │   └── out/
│   │   └── _shared/          # 共通アセット
│   │       └── images/
│   └── configs/
│       ├── nginx/
│       │   └── sites-enabled/
│       ├── pm2/
│       │   └── ecosystem.config.js
│       └── systemd/
│           └── techdoc.service
└── logs/
    ├── nginx/
    ├── pm2/
    └── app/
```

## 🚀 Phase 1: 初期移行（Week 1-2）

### 1.1 VPS環境準備

```bash
# 必要なソフトウェアのインストール
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx nodejs npm git postgresql redis-server certbot python3-certbot-nginx

# Node.js 20のインストール
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2のインストール
sudo npm install -g pm2 pnpm

# ディレクトリ作成
mkdir -p ~/techdoc/{apps,sites,configs,logs}

# （任意）cloudflared の導入（早期にゼロトラスト化）
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
# curl -fsSL https://pkg.cloudflare.com/cloudflared/install.sh | sudo bash
```

### 1.2 Nginx設定（修正版：locationのネスト排除・auth_request採用・API分離）

```nginx
# /etc/nginx/sites-available/techdoc
upstream nextjs_api {
    server 127.0.0.1:3000;
    keepalive 64;
}

# 共通のキャッシュ設定
proxy_cache_path /var/cache/nginx/techdoc levels=1:2 keys_zone=techdoc_cache:10m max_size=1g inactive=60m use_temp_path=off;

########################################################################
# 静的サイト配信用サーバーブロック（*.ai-pit.net）
########################################################################
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ~^(?<sub>[^.]+)\.ai-pit\.net$;

    # TLS（Let’s Encrypt 例。Cloudflare Origin Certでも可）
    ssl_certificate     /etc/letsencrypt/live/ai-pit.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ai-pit.net/privkey.pem;

    # サイト名の抽出（デフォルトv0）
    set $site_name $sub;
    if ($site_name = "") { set $site_name "v0"; }

    # ログ設定
    access_log /home/ubuntu/logs/nginx/$site_name.access.log;
    error_log  /home/ubuntu/logs/nginx/$site_name.error.log;

    # 静的ファイルのルート
    root /home/ubuntu/techdoc/sites/$site_name/out;

    # 圧縮
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/javascript application/xml image/svg+xml;

    # 静的ファイル配信（基本ルート）
    location / {
        try_files $uri $uri.html $uri/index.html @api;
    }

    # アセットは長期キャッシュ
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTMLは短期キャッシュ（CDN前提）
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # 有料コンテンツの保護（JWT検証をGatewayへサブリクエスト）
    location ~ ^/(premium|pro|paid)/ {
        auth_request /internal/auth;
        try_files $uri $uri.html $uri/index.html =404;
    }

    # auth_request用の内部ロケーション
    location = /internal/auth {
        internal;
        proxy_pass http://nextjs_api/api/validate;
        proxy_set_header Authorization $http_authorization;
        proxy_set_header X-Original-URI $request_uri;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
    }

    # API・SSRなどはNext.jsへプロキシ（フォールバック）
    location @api {
        proxy_pass http://nextjs_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }
}

########################################################################
# API専用サーバーブロック（api.ai-pit.net）
########################################################################
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.ai-pit.net;

    ssl_certificate     /etc/letsencrypt/live/api.ai-pit.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ai-pit.net/privkey.pem;

    location / {
        proxy_pass http://nextjs_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

補足（要点）
- Nginxではlocationの入れ子不可。上記は並列定義に修正。
- `api.ai-pit.net`は静的配信サーバーと分離し、設定を明確化。
- `auth_request`でJWT検証を行い、Cookie有無チェックのみの保護を排除。
- TLSは443で終端（Cloudflare経由ならFull strictを推奨）。

カスタムドメイン対応（概要）
- `map $host $site_name { default v0; example.com siteA; docs.example.com siteB; }` のようにマップを定義し、`root`へ反映。
- もしくはWorkers/KVで `host -> siteId` を一元管理し、将来的にCloudflare側へ移譲。

### 1.3 PM2設定

```javascript
// ~/techdoc/configs/pm2/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'techdoc-gateway',
      script: '/home/ubuntu/techdoc/apps/gateway/server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'postgresql://user:pass@localhost/techdoc',
        NEXTAUTH_URL: 'https://api.ai-pit.net',
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
      },
      error_file: '/home/ubuntu/logs/pm2/error.log',
      out_file: '/home/ubuntu/logs/pm2/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    }
  ]
};
```

### 1.4 SSGビルドスクリプト

```bash
#!/bin/bash
# ~/techdoc/apps/builder/build-deploy.sh

SITE_NAME=$1
BUILD_DIR="/tmp/build-${SITE_NAME}"
OUTPUT_DIR="/home/ubuntu/techdoc/sites/${SITE_NAME}"
BACKUP_DIR="/home/ubuntu/backups/${SITE_NAME}/$(date +%Y%m%d_%H%M%S)"

echo "🔨 Building site: ${SITE_NAME}"

# ビルド環境準備
rm -rf ${BUILD_DIR}
mkdir -p ${BUILD_DIR}
cd ${BUILD_DIR}

# ソースコードのクローン
git clone --depth 1 https://github.com/yourusername/techdoc.git .

# 依存関係インストール
pnpm install --frozen-lockfile

# サイト別ビルド
BUILD_TARGET_SITES=${SITE_NAME} pnpm run build:ssg

# バックアップ作成
if [ -d "${OUTPUT_DIR}/out" ]; then
    mkdir -p ${BACKUP_DIR}
    mv ${OUTPUT_DIR}/out ${BACKUP_DIR}/
    echo "📦 Backup created at: ${BACKUP_DIR}"
fi

# 新しいビルドをデプロイ
mkdir -p ${OUTPUT_DIR}
mv ./sites/${SITE_NAME}/out ${OUTPUT_DIR}/

# Nginxリロード
sudo nginx -s reload

echo "✅ Site ${SITE_NAME} deployed successfully"
```

### 1.5 デプロイ自動化

```yaml
# .github/workflows/deploy-vps.yml
name: Deploy to ConoHa VPS

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      site:
        description: 'Target site to deploy'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - claude-code
          - v0

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        site: ${{ fromJson(github.event.inputs.site == 'all' && '["claude-code", "v0"]' || format('["{0}"]', github.event.inputs.site)) }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build SSG for ${{ matrix.site }}
        run: |
          BUILD_TARGET_SITES=${{ matrix.site }} pnpm run build:ssg
          tar -czf ${{ matrix.site }}-build.tar.gz -C ./sites/${{ matrix.site }}/out .

      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "${{ matrix.site }}-build.tar.gz"
          target: "/tmp/"

      - name: Extract and activate
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            SITE="${{ matrix.site }}"
            DEPLOY_DIR="/home/ubuntu/techdoc/sites/${SITE}"
            BACKUP_DIR="/home/ubuntu/backups/${SITE}/$(date +%Y%m%d_%H%M%S)"

            # バックアップ
            if [ -d "${DEPLOY_DIR}/out" ]; then
              mkdir -p ${BACKUP_DIR}
              mv ${DEPLOY_DIR}/out ${BACKUP_DIR}/
            fi

            # 展開
            mkdir -p ${DEPLOY_DIR}/out
            tar -xzf /tmp/${SITE}-build.tar.gz -C ${DEPLOY_DIR}/out

            # クリーンアップ
            rm /tmp/${SITE}-build.tar.gz

            # Nginx再読み込み
            sudo nginx -s reload

            echo "✅ Deployed ${SITE} successfully"

      - name: Purge Cloudflare HTML cache (optional)
        if: ${{ secrets.CF_ZONE_ID != '' && secrets.CF_API_TOKEN != '' }}
        env:
          CF_ZONE_ID: ${{ secrets.CF_ZONE_ID }}
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
        run: |
          # 変更されたHTMLのみのパージが理想（Cache-Tag利用推奨）
          # サンプルとしてトップとサイトインデックスをパージ
          curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
            -H "Authorization: Bearer ${CF_API_TOKEN}" \
            -H 'Content-Type: application/json' \
            --data '{
              "files": [
                "https://${{ matrix.site }}.ai-pit.net/",
                "https://${{ matrix.site }}.ai-pit.net/index.html"
              ]
            }'
```

## 📊 Phase 2: 最適化と改善（Week 3-4）

### 2.1 パフォーマンスチューニング

```bash
# Nginxワーカープロセス最適化
# /etc/nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    # ファイル送信の最適化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # Keep-alive設定
    keepalive_timeout 65;
    keepalive_requests 100;

    # バッファサイズ
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;
    output_buffers 32 32k;
    postpone_output 1460;

    # ファイルキャッシュ
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

### 2.2 モニタリング設定

```bash
# Netdata インストール（システムモニタリング）
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# PM2 モニタリング
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# （推奨）アプリ/Edgeの観測性を補強
# - Sentry（Next.js/Gateway）
# - Workers Logpush/Analytics Engine（のちのPhaseで導入）
# - 構造化JSONログを標準出力→収集（jq/Fluent Bitなど）

# カスタムヘルスチェックエンドポイント
# apps/gateway/pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
}
```

### 2.3 バックアップとリカバリ

```bash
#!/bin/bash
# /home/ubuntu/scripts/backup.sh

BACKUP_ROOT="/home/ubuntu/backups"
SITES_DIR="/home/ubuntu/techdoc/sites"
DB_NAME="techdoc"
DATE=$(date +%Y%m%d_%H%M%S)

# サイトファイルのバックアップ
for site in $(ls ${SITES_DIR}); do
    tar -czf ${BACKUP_ROOT}/sites/${site}_${DATE}.tar.gz -C ${SITES_DIR} ${site}
done

# データベースバックアップ
pg_dump ${DB_NAME} | gzip > ${BACKUP_ROOT}/db/techdoc_${DATE}.sql.gz

# 古いバックアップを削除（7日以上）
find ${BACKUP_ROOT} -type f -mtime +7 -delete

# S3へのアップロード（オプション）
# aws s3 sync ${BACKUP_ROOT} s3://your-backup-bucket/vps-backups/
```

## 💰 コスト分析

### Phase 1 (VPSのみ)
```yaml
インフラ:
  ConoHa VPS (2GB): ¥1,000/月
  ドメイン管理: ¥100/月
  SSL証明書: ¥0 (Let's Encrypt)
合計: ¥1,100/月
```

### Phase 2 (ハイブリッド)
```yaml
インフラ:
  ConoHa VPS (2GB): ¥1,000/月
  Cloudflare R2: ¥100-300/月
  Cloudflare Pro: ¥2,000/月（オプション）
合計: ¥1,100-3,300/月
```

### Phase 3 (フル移行)
```yaml
インフラ:
  ConoHa VPS (1GB): ¥500/月（縮小）
  Cloudflare Workers: ¥500/月
  Cloudflare R2: ¥300/月
  その他: ¥200/月
合計: ¥1,500/月
```

## 📈 KPI・成功指標

### 技術指標

| メトリクス | 現在 | Phase 1目標 | Phase 2目標 | 測定方法 |
|-----------|-----|------------|------------|---------|
| ビルド時間 | 15分 | 5分 | 3分 | GitHub Actions |
| TTFB | 1000ms | 300ms | 100ms | GTmetrix |
| ページロード | 5秒 | 2秒 | 1秒 | Lighthouse |
| 同時接続数 | 50 | 200 | 500 | Apache Bench |

### ビジネス指標

| メトリクス | 現在 | 3ヶ月後目標 | 測定方法 |
|-----------|-----|------------|---------|
| ページビュー | - | +50% | Google Analytics |
| 直帰率 | - | -20% | Google Analytics |
| コンバージョン率 | - | +30% | Stripe Dashboard |

## 🚨 リスク管理

### リスクと対策

| リスク | 影響度 | 対策 |
|-------|-------|-----|
| VPSダウン | 高 | 定期バックアップ、監視アラート設定 |
| トラフィック急増 | 中 | Cloudflareレート制限、スケールアップ準備 |
| セキュリティ侵害 | 高 | WAF設定、定期的な脆弱性スキャン |
| デプロイ失敗 | 低 | Blue-Greenデプロイ、自動ロールバック |

### 緊急時対応

```bash
# 1. サービス復旧手順
sudo systemctl restart nginx
pm2 restart all
pm2 logs --lines 100

# 2. ロールバック手順
cd /home/ubuntu/techdoc/sites/[site-name]
mv out out.broken
mv /home/ubuntu/backups/[site-name]/[latest]/out .
sudo nginx -s reload

# 3. 緊急メンテナンスモード
echo "メンテナンス中" > /var/www/maintenance.html
# Nginx設定で全リクエストをmaintenance.htmlへ
```

## 📅 タイムライン

### Week 1-2: Phase 1実装

- [ ] VPS環境セットアップ
- [ ] Nginx設定とSSG配信テスト
- [ ] APIゲートウェイ実装
- [ ] 1サイト（v0）での検証
- [ ] 監視・ログ設定

### Week 3-4: 安定化と最適化

- [ ] パフォーマンスチューニング
- [ ] 全サイト移行
- [ ] 自動デプロイ設定
- [ ] バックアップシステム構築
- [ ] ドキュメント整備

### Month 2: Phase 2準備

- [ ] Cloudflare R2セットアップ
- [ ] 画像最適化パイプライン
- [ ] CDN設定最適化
- [ ] コスト分析と最適化

### Month 3: Phase 3検討

- [ ] Edge Workers検証
- [ ] 完全移行の判断
- [ ] スケーリング計画

## ✅ チェックリスト

### 移行前確認

- [ ] 現在のデータバックアップ完了
- [ ] DNS切り替え準備
- [ ] SSL証明書準備
- [ ] 環境変数リスト作成
- [ ] 依存サービス確認（Stripe, Auth等）
- [ ] 有料本文がSSG成果物に含まれていないこと（公開不可データの確認）

### 移行後確認

- [ ] 全ページアクセス確認
- [ ] 認証フロー動作確認
- [ ] 決済フロー動作確認
- [ ] SEOインパクト確認
- [ ] パフォーマンス測定
- [ ] 有料ページの直接URL/直リンクからの不正閲覧が不可であること

## 📚 参考資料

- [Nginx公式ドキュメント](https://nginx.org/en/docs/)
- [PM2ドキュメント](https://pm2.keymetrics.io/)
- [ConoHa VPSドキュメント](https://support.conoha.jp/v/)
- [Next.js SSG/ISRガイド](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

---

*作成日: 2025年9月*
*最終更新: 2025年9月*
