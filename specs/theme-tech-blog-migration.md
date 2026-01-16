---
title: 新テーマ「tech-blog」移行計画（Gatsby→Next.js）
---

# 新テーマ「tech-blog」移行計画（Gatsby→Next.js）

本ドキュメントは、既存の GatsbyJS プロジェクト（例: `website-tech-blog`）のレイアウト/React コンポーネントを活かしつつ、新しい Next.js テーマ `theme/tech-blog` を作成し、既存のマルチサイトSSG配信パイプライン（VPS + Cloudflare プロキシ）に統合するための移行計画です。

## ゴール

- Gatsby 専用の GraphQL 依存を排除し、Next.js 15 App Router + MDX + ファイル走査/Frontmatter 集計で同等機能を実現
- 既存 CSS をまずはそのまま移植（デザイン/動作を優先）
- 画像最適化は `next-image-export-optimizer` を採用
- 既存の SSG 前処理（画像収集・アセット準備・静的検索）と `dev.sh`/`deploy.sh` による per-site 運用を踏襲

## スコープ

- 新規テーマ: `theme/tech-blog`（テーマID: `tech-blog`）
- 参照コンテンツ: `contents/{SITE_ID}/contents/**`（MD/MDX）
- 画像: リポジトリ直下 `images/**`（/images/** で参照）
- 出力: `theme/tech-blog/out/`（SSG成果物）

## テーマ契約（共通要件）

- 環境変数
  - `SITE_ID`（必須）: 参照するサイトID
  - `SSG_EXPORT`（任意）: `'1'` で静的エクスポート
  - `NEXT_PUBLIC_SEARCH_STATIC`（任意）: `'1'` で静的検索
- 入力: `../../contents/{SITE_ID}/contents` を参照
- 画像: `/images/**` を参照（ビルド前に必要分のみ `public/images/**` へコピー）
- 出力: `out/` に静的成果物を生成
- 前処理（推奨）
  - `scripts/collect-images.mjs`（参照画像のマニフェスト生成）
  - `scripts/prepare-site-assets.mjs`（画像/ブランド資産のコピー）
  - `scripts/generate-search-index.mjs`（Orama 静的検索インデックス）

## 実装フェーズ

### Phase 0: 事前確認
- Gatsby プロジェクトのソース/依存/資産の棚卸
- 主要ページの対象範囲の確認（トップ/記事詳細/一覧/タグ/アーカイブ）

### Phase 1: 雛形生成
- `scripts/scaffold-theme.sh tech-blog --from fumadocs` で `theme/tech-blog` を作成
- `package.json` の `name`/`scripts` を確認し、prebuild/dev/build に前処理を組み込む
- 初回 `pnpm install`（dev.sh からも自動実行）

### Phase 2: レイアウト移植（UIシェル）
- Gatsby の Layout（Header/Footer/Nav/Breadcrumb）を `app/layout.tsx` + `src/components/**` に移植
- ルーティング置き換え
  - `gatsby Link` → `next/link`
  - `navigate` → `useRouter` / `router.push`
- スタイル
  - 既存 CSS を `src/styles/` 配下へ移し、`app/layout.tsx` で import（PostCSS/Autoprefixer は任意）

### Phase 3: コンテンツ/Frontmatter 集計
- GraphQL を使わず、ファイル走査 + Frontmatter で記事メタを集計
  - フィールド例: `title`, `date`, `tags`, `description`/`excerpt`, `cover`
  - zod で Frontmatter スキーマを定義
- MDX パイプライン
  - 既存の remark/rehype（画像解決など）を流用し、見た目は Gatsby に合わせてカスタムコンポーネントで調整

### Phase 4: ページ実装
- トップページ（最新投稿/ピックアップ）
- 記事一覧ページ（ページネーションは任意）
- 記事詳細 `app/[[...slug]]/page.tsx`（TOC・前後ナビ）
- タグ一覧/タグ詳細（Frontmatter の `tags` を集計）

### Phase 5: 画像最適化/パス統一
- `next-image-export-optimizer` を採用
- 画像参照は `/images/**`（相対パスは rehype で `/images/**` に正規化）
- ブランド資産は `images/{SITE_ID}/brand/*` または `contents/{SITE_ID}/specs/*`

### Phase 6: SEO/メタデータ
- `generateMetadata` で `title/description/og:image/twitter` を Frontmatter から組み立て
- `metadataBase` を設定
- JSON-LD（BlogPosting）を詳細ページに付与（任意）

### Phase 7: 検索/ナビゲーション
- 静的検索（Orama）を有効化（`NEXT_PUBLIC_SEARCH_STATIC=1`）
- 既存の検索 UI を流用/カスタマイズ
- サイドバー/メニューは `specs/sitemap.md` または自動構築

### Phase 8: ビルド/デプロイ
- `./dev.sh {SITE_ID} tech-blog` で起動確認
- `cd theme/tech-blog && SITE_ID={SITE_ID} SSG_EXPORT=1 NEXT_PUBLIC_SEARCH_STATIC=1 pnpm build`
- `./deploy.sh {SITE_ID} tech-blog` で `/var/www/docs-staging/{SITE_ID}/` に同期（ConoHa VPS）

### Phase 9: QA/パフォーマンス
- Lighthouse による計測（TTFB/LCP/CLS）
- 画像サイズ/フォーマットの見直し（WebP/AVIF）
- 体裁崩れ/ダークモード/アクセシビリティ確認

### Phase 10: ドキュメント化
- `docs/setup/multi-theme-ssg.md` に tech-blog の特記事項を追記
- `theme/tech-blog/README.md` でセットアップとカスタマイズ方法を明記

## コンテンツ/ルーティング設計（サンプル）

```
theme/tech-blog/
├── app/
│   ├── layout.tsx              # グローバルレイアウト（既存CSS読込）
│   ├── page.tsx                # トップ（最新投稿）
│   ├── tags/
│   │   ├── page.tsx            # タグ一覧
│   │   └── [tag]/page.tsx      # タグ詳細
│   └── [[...slug]]/page.tsx    # 記事詳細（MDX）
├── src/
│   ├── components/             # Gatsby由来のUI移植
│   ├── lib/                    # ファイル走査/Frontmatter集計
│   └── styles/                 # 既存CSS
└── scripts/                    # 画像/検索 前処理
```

## 画像ポリシーと前処理

- `/images/**` を単一プールとして運用（サイトIDに制限なし）
- `collect-images.mjs` が MD/MDX 参照から必要画像のみを抽出し、`prepare-site-assets.mjs` が `public/images/**` にコピー
- 本番デプロイでは、サイト別に必要画像のみが含まれる（最小配布）

## 受入基準（Definition of Done）

- `theme/tech-blog` で dev/build/deploy が通る
- トップ/一覧/詳細/タグの基本ページが動作し、Frontmatter に基づく情報が正しく表示
- 画像最適化（`next-image-export-optimizer`）と静的検索（Orama）が動作
- 既存 CSS によるデザインが概ね再現
- Nginx + Cloudflare プロキシ構成での配信が可能

## リスク/留意点

- Gatsby GraphQL 依存の置き換えで、集計/並び替えロジックを実装し直す必要あり
- 既存 CSS の階層/命名が Next 側の構造と衝突する可能性（最初はそのまま、後で整理）
- 画像のパス正規化（相対→/images/**）に漏れがあるとビルド/表示で欠落する可能性

## 運用コマンド（リマインド）

```
# 開発
./dev.sh v0 tech-blog

# ビルド（SSG）
cd theme/tech-blog
SITE_ID=v0 SSG_EXPORT=1 NEXT_PUBLIC_SEARCH_STATIC=1 pnpm build

# デプロイ（VPS）
./deploy.sh v0 tech-blog
```

