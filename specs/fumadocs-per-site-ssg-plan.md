---
title: Fumadocsサイト単位SSG配信計画
---

# Fumadocsサイト単位SSG配信計画

## 目的

- `contents/[site-id]/contents/**/*.md(x)` をソースに、`theme/fumadocs` を用いてサイト単位で開発サーバー起動・ビルド・SSG生成・ステージングデプロイを可能にする。
- コマンドは下記を想定する。
  - 開発: `./dev.sh [site-id]`
  - デプロイ(SSG生成→配布): `./deploy.sh [site-id]`

## スコープ

- 対象プロジェクト: `theme/fumadocs` (Next.js + Fumadocs 構成)
- 対象コンテンツ: ルートの `contents/[site-id]/contents/**`
- 既存アプリ(ルートの `src/app` 等)の挙動やデプロイは影響させない。

## 方針（ハイレベル）

1. サイト選択
   - 環境変数 `SITE_ID` を単一の真実のソースとする。
   - `./dev.sh [site-id]`・`./deploy.sh [site-id]` から `SITE_ID` を渡す。

2. コンテンツ解決
   - `theme/fumadocs/source.config.ts` の `defineDocs` に `dir` と `files` を指定し、`SITE_ID` 経由で `../../contents/${SITE_ID}/contents` を参照。
   - 可能なら絶対パス参照を採用（`process.cwd()` と `path.resolve`）し、ワークディレクトリ差異の影響を排除。

3. 開発サーバー（サイト限定）
   - `theme/fumadocs` 配下で Next.js dev を起動。
   - `SITE_ID` を注入し、対象サイト配下のみをドキュメントソースとして解決。
   - 既存の `theme/fumadocs/content/` はサンプルのまま残し、`SITE_ID` 指定時は無効化（読み込まない）。

4. ビルド/SSG 生成（サイト限定）
   - SSG 出力を有効化するため、`theme/fumadocs/next.config.mjs` を条件付きで `output: 'export'` に切替（`SSG_EXPORT=1` 時）。
   - 生成先は `theme/fumadocs/out/`（Next.js Export の既定）。
   - `basePath` が必要な場合（ステージングをパスベースで多重配置する場合）は `BASE_PATH=/${SITE_ID}` をサポート。

5. ステージングデプロイ
   - 静的ホスティング方針。
   - `rsync` で `theme/fumadocs/out/` をステージングの配信ディレクトリ（例: `/var/www/docs-staging/[site-id]/`）に配置。
   - 必要に応じて `nginx`/`Caddy` 等の vhost / location を別途設定。

6. 変更検知（任意/将来拡張）
   - オプション: `[site-id]` 無指定時、`git diff --name-only` から直近の変更ファイルを解析し `contents/<site-id>/` ごとの差分を集計、変更のあったサイトだけを対象にする。

## 実装詳細

### 1) Fumadocs のソース切替

- 対象: `theme/fumadocs/source.config.ts`
- 変更点:
  - `SITE_ID` が設定されていれば `dir` を `../../contents/${SITE_ID}` に、`files` を `contents/**/*.{md,mdx}` に設定。
  - 未設定時は従来の `content/` を使う（後方互換）。
  - 絶対パス化: `const root = path.resolve(__dirname, '..', '..')` などでワークスペースルートを算出。

擬似コード（イメージ）:

```ts
// theme/fumadocs/source.config.ts
import path from 'node:path'
const root = path.resolve(__dirname, '..', '..')
const siteId = process.env.SITE_ID
const docsDir = siteId
  ? path.join(root, 'contents', siteId)
  : path.join(process.cwd(), 'content')

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    files: siteId ? ['contents/**/*.{md,mdx}'] : ['**/*.{md,mdx}'],
    schema: frontmatterSchema,
  },
  meta: { schema: metaSchema },
})
```

### 2) Export 出力の条件化

- 対象: `theme/fumadocs/next.config.mjs`
- 変更点:
  - `process.env.SSG_EXPORT === '1'` のとき `output: 'export'`。
  - `BASE_PATH` 指定があれば `basePath` を設定（例: `/${process.env.BASE_PATH.replace(/^\//,'')}`）。

イメージ:

```js
const isExport = process.env.SSG_EXPORT === '1'
const basePath = process.env.BASE_PATH || ''
const config = {
  ...(isExport ? { output: 'export' } : { output: 'standalone' }),
  ...(basePath ? { basePath } : {}),
}
export default withMDX(config)
```

### 3) 開発フロー（dev.sh）

- 対象: ルート `dev.sh`
- 変更点:
  - 引数 `[site-id]` を必須/デフォルト可（`v0` 等）。
  - 実行ディレクトリを `theme/fumadocs` に `cd`。
  - `SITE_ID` を渡し、Next Dev を起動。
  - 既存の検索インデックス生成ロジックを流用（`--site`）。`outDir` は `theme/fumadocs/public/search-index`。

実行例:

```bash
SITE_ID=$1 \
  node ../../scripts/build-search-index.mjs --site "$SITE_ID" --basePattern "/sites/{site}" --outDir public/search-index

SITE_ID=$1 pnpm dev -p 4000
```

### 4) デプロイフロー（deploy.sh）

- 対象: ルート `deploy.sh`
- 変更点:
  - 引数 `[site-id]` が指定された場合のみ Fumadocs SSG を実行し、静的ファイルをステージングへ rsync。
  - `SSG_EXPORT=1` と `SITE_ID`（必要なら `BASE_PATH`）を渡して `pnpm build`。
  - 生成物 `theme/fumadocs/out/` → リモート `DOCS_REMOTE_PATH/[site-id]/` へ配置。
  - 既存の Node アプリ配布ロジックは `[site-id]` 未指定時に従来通り実行（後方互換）。

擬似コマンド:

```bash
pushd theme/fumadocs
SSG_EXPORT=1 SITE_ID="$SITE_ID" BASE_PATH="/$SITE_ID" pnpm build
rsync -avz --delete out/ "$REMOTE_USER@$REMOTE_HOST:$DOCS_REMOTE_PATH/$SITE_ID/"
popd
```

### 5) 環境変数とパス

- 必須: `SITE_ID`
- 任意: `BASE_PATH`（例: `/$SITE_ID`）、`PORT`（dev）
- ステージング: `DOCS_REMOTE_PATH`（例: `/var/www/docs-staging`）

### 6) 受け入れ基準

- `./dev.sh v0` で `theme/fumadocs` の dev サーバーが起動し、`contents/v0/contents` のみが反映される。
- `./deploy.sh v0` で `theme/fumadocs/out/` が生成され、`v0` サイトの静的ファイルがリモートの `DOCS_REMOTE_PATH/v0/` にデプロイされる。
- `site-id` を変えても同様に動作する。

### 7) テスト計画

1. ローカル開発
   - `./dev.sh v0` 起動→ページ参照→`contents/v0/contents` を更新→HMR/再生成が反映されること。
2. ローカルビルド
   - `pushd theme/fumadocs && SSG_EXPORT=1 SITE_ID=v0 pnpm build && popd`
   - `theme/fumadocs/out/` が生成され、リンク切れがないこと。
3. ステージング
   - `./deploy.sh v0` 実行→ `https://staging.example.com/v0/`（例）で表示確認。

### 8) リスクと緩和

- ルートアプリと Fumadocs の依存競合: 各プロジェクトは独立ディレクトリでインストール・ビルド。
- 絶対パス解決の誤り: `path.resolve` のみ使用、`process.cwd()` 依存を避ける。
- `basePath` 必要性: ステージングの配下配置に合わせてフラグで切替可能に。

### 9) 実装タスク

1. `theme/fumadocs/source.config.ts` に `SITE_ID` ベースの `dir`/`files` 切替を追加。
2. `theme/fumadocs/next.config.mjs` に `SSG_EXPORT`/`BASE_PATH` 条件を追加。
3. ルート `dev.sh` を `theme/fumadocs` ベース起動に対応（`SITE_ID` 渡し）。
4. ルート `deploy.sh` に `[site-id]` 指定時の SSG デプロイ分岐と `DOCS_REMOTE_PATH` を追加。
5. ドキュメント更新（README/運用ガイド）。

### 10) ロールバック

- 変更は条件付き動作（環境変数が無い場合は現行互換）とし、`SITE_ID` を渡さなければ既存フローに回帰可能。

### 11) 今後の拡張

- 複数 `site-id` の一括ビルド（引数で配列/CSV対応）。
- 変更検知で自動対象選択（`git diff` / `nx affected` 的なアプローチ）。
- 共通アセットのキャッシュ最適化と差分デプロイ。

