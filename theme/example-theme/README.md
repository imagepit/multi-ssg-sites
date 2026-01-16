# Fumadocs ドキュメントサイト

このリポジトリは、Next.js 15で構築された**Fumadocsベースのドキュメントサイト**です。`SITE_ID`環境変数によるコンテンツソースの切り替えにより、単一のコードベースで複数のドキュメントサイトを提供する**マルチサイトアーキテクチャ**をサポートしています。

## 開発コマンド

```bash
# 開発環境（プリビルドスクリプトを含む）
pnpm dev

# 本番ビルド（検索インデックス、画像などのプリビルドスクリプトを含む）
pnpm build

# 本番サーバー起動
pnpm start

# リンティング
pnpm lint
```

### ビルドプロセス

ビルドパイプライン（`prebuild`スクリプト）は以下の手順を自動実行します：

1. **manage-api-route.mjs** - SSRとSSGのAPIルートを切り替え
2. **collect-images.mjs** - コンテンツディレクトリから画像を収集
3. **prepare-site-assets.mjs** - サイト固有のブランディングアセットを準備
4. **generate-search-index.mjs** - 静的検索用のOrama検索インデックスを生成

## アーキテクチャ

### マルチサイトシステム

このコードベースは、環境ベースのコンテンツ切り替えにより複数のドキュメントサイトをサポートしています：

- **SITE_ID / NEXT_PUBLIC_SITE_ID**: ビルドするサイトを決定
- コンテンツ場所: `../../contents/${SITE_ID}/contents/` (SITE_IDが設定されている場合)
- サイト設定: `../../contents/${SITE_ID}/specs/spec.json`
- サイトマップ構造: `../../contents/${SITE_ID}/specs/sitemap.md`

主要ファイル：
- [source.config.ts](source.config.ts) - SITE_IDに基づいてコンテンツディレクトリを制御
- [src/lib/source.ts](src/lib/source.ts) - Fumadocsコンテンツを読み込み、`sitemap.md`からサイドバーを構築
- [src/lib/site-config.ts](src/lib/site-config.ts) - サイト固有の設定（テーマ、ブランディング、メタデータ）を読み込み

### コンテンツパイプライン

1. **ソース設定** ([source.config.ts](source.config.ts))
   - MDXファイルを読み込むディレクトリを定義
   - コンテンツ処理用のカスタムremark/rehypeプラグインを設定
   - 除外ファイル: `README.md`, `AGENTS.md`, `CLAUDE.md`

2. **カスタムMDXプラグイン** ([src/lib/](src/lib/)内)
   - `remark-files-to-mdx` - ファイルツリー構文をMDXに変換
   - `remark-steps` - ステップバイステップのチュートリアルブロック
   - `remark-code-title` - コードブロックタイトル
   - `remark-admonition-blocks` - コールアウト/アドモニションブロック
   - `remark-adddel` - コードブロックの追加/削除の差分領域、ハイライト、フォーカス、警告、エラーをハイライト表示
   - `rehype-resolve-images` - 画像パスを解決
   - `rehype-next-image` - imgタグをNext.js Imageコンポーネントに変換
   - `shiki-raw-notation` - 生の記法サポート付きシンタックスハイライト

3. **サイドバー生成** ([src/lib/source.ts](src/lib/source.ts))
   - `specs/sitemap.md`を解析してサイドバーツリーを構築
   - サイトマップが見つからない場合は自動生成ツリーにフォールバック
   - ネストしたフォルダとインデックスページをサポート

### 検索システム

`NEXT_PUBLIC_SEARCH_STATIC`で制御される2つのモード：

1. **SSR検索（デフォルト）**: `/api/search`エンドポイントを使用
2. **SSG検索（SSG_EXPORT=1）**: 事前生成されたOramaインデックスを使用
   - インデックス場所: `public/search-indexes/${SITE_ID}.json`
   - [scripts/generate-search-index.mjs](scripts/generate-search-index.mjs)で生成
   - `Intl.Segmenter`による日本語トークン化をサポート
   - ページレベルと見出しレベル（h2、h3）のコンテンツをインデックス化

検索コンポーネント: [src/components/CustomStaticSearchDialog.tsx](src/components/CustomStaticSearchDialog.tsx)

### テーマシステム

`specs/spec.json`によるサイト固有のテーマ設定：

```json
{
  "theme_config": {
    "colors": {
      "primary": "#hex-color"
    },
    "branding": {
      "logo": "logo.svg",
      "favicon": "favicon.ico",
      "og_image": "og.png"
    }
  }
}
```

テーマは[src/lib/theme-derive.ts](src/lib/theme-derive.ts)で動的にCSS変数を生成して適用されます。

### エクスポートモード

静的エクスポート用のビルド：

```bash
SSG_EXPORT=1 pnpm build
```

これにより以下が有効になります：
- Next.js設定で`output: 'export'`
- 静的検索インデックス生成
- `next-image-export-optimizer`による画像最適化
- SSR APIルートの無効化

## 重要なパターン

### パスエイリアス

- `@/*` - `src/*`を指す
- `@/.source` - `.source/index.ts`を指す（fumadocs-mdxで生成）

### 画像処理

画像は`next-image-export-optimizer`を使用したカスタムローダー（[src/image-loader.ts](src/image-loader.ts)）を使用：
- WebPとAVIFをサポート
- ブラープレースホルダーを生成
- 静的エクスポートモードで動作

#### グローバル画像ポリシー（サイト別SSG）

- ワークスペース直下の `images/` を、全サイト共通の画像プールとして扱います。
- コンテンツからはサイトIDに関係なく `/images/**` を参照できます。
- ビルド時に `scripts/collect-images.mjs` が対象サイトのMD/MDXから参照画像のみを収集し、
  `scripts/prepare-site-assets.mjs` がその画像だけを `public/images/**` にコピーします。
- これにより、各サイトのSSG成果物には必要な画像のみが含まれます（サイズ最適化に有効）。
- マニフェストが存在しない場合のフォールバックでは、開発時の欠落を避けるため `images/` 全体をコピーします。

### コンテンツ構造

期待されるコンテンツディレクトリ構造：
```
contents/${SITE_ID}/
├── specs/
│   ├── spec.json       # サイト設定
│   └── sitemap.md      # サイドバー構造
└── contents/           # MDXファイル
    ├── index.mdx
    └── ...
```

### メモリ最適化

ビルドは[next.config.mjs](next.config.mjs)でメモリ最適化設定を使用：
- ビルド用に`NODE_OPTIONS='--max-old-space-size=4096'`
- メモリベースのワーカー数
- ベンダーチャンクのコード分割

## 一般的なタスク

### カスタムRemark/Rehypeプラグインの追加

1. `src/lib/remark-*.ts`または`src/lib/rehype-*.ts`にプラグインを作成
2. [source.config.ts](source.config.ts)の`remarkPlugins`または`rehypePlugins`配列に追加
3. 順序が重要：remarkはrehypeより先に実行

### 検索インデックスのカスタマイズ

[scripts/generate-search-index.mjs](scripts/generate-search-index.mjs)を修正：
- コンテンツ抽出のために`extractTextFromMarkdown()`を調整
- 見出しインデックス化ルールを変更するために`extractHeadings()`を修正
- 新しいフィールドを追加する場合はOramaスキーマを更新

### サイト固有アセットの追加

アセットは`public/sites/${SITE_ID}/`に配置：
- `scripts/prepare-site-assets.mjs`で自動準備
- `/brand/${filename}`ルートでアクセス

### ビルド問題のデバッグ

プリビルドスクリプトのログを確認：
```bash
# 個別のプリビルドステップを実行
node scripts/manage-api-route.mjs
node scripts/collect-images.mjs
node scripts/prepare-site-assets.mjs
SITE_ID=mysite node scripts/generate-search-index.mjs
```
