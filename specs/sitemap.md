---
title: Fumadocsサイト単位sitemap.md一本化計画
---

# Fumadocsサイト単位sitemap.md一本化計画

## 目的

- Sidebarを`contents/[siteid]/specs/sitemap.md`（Markdownリスト）から生成し、順序と階層をそのまま表示。
- page.csvを廃止し、ナビ生成・ページ解決・前後ナビ・静的生成・検索URL解決の全てをsitemap.mdに統一。

## 対象と影響

- 対象テーマ: documentation（ブログ等は除外。ただしCSV依存箇所は全置換）
- 主な置換箇所:
  - `src/lib/content-loader.ts`（CSV系メソッドをsitemapベースへ差し替え）
  - `src/app/sites/[techKeywordId]/page.tsx`（ナビ生成）
  - `src/app/sites/[techKeywordId]/[...slug]/page.tsx`（ナビ生成・前後ナビ・静的生成）
  - `src/app/api/search/route.ts`（検索結果→URL変換の参照キャッシュ）
  - `src/lib/blog-data.ts`（CSV依存の投稿一覧生成をFS走査＋frontmatterへ）

## データモデル（新）

- SitemapEntry
  - `title: string` — 表示タイトル（Markdownリンクのラベル）
  - `slug: string` — `.md`拡張子を除いた相対スラッグ（例: `overview/what-is-claude-code`）
  - `filepath: string` — 実Markdownの相対パス（例: `contents/overview/what-is-claude-code.md`）
  - `children: SitemapEntry[]` — 子ノード
  - `level: number` — 深さ（0起点）
- サイト単位でパース結果をモジュールスコープにキャッシュ（`mtime`で無効化）

## sitemap.mdパース仕様

- `- [タイトル](リンク)` 形式のリストを走査し、入れ子（順序・階層）をそのまま保持。
- リンク正規化:
  - 先頭の `./` `/` `contents/` を除去、末尾の `/` や `#アンカー` を除去。
  - `.md`/`.mdx` は`slug`からは除去、`filepath` には残す（未指定時は自動補完）。
- `filepath` 解決:
  - 明示拡張あり → `contents/<link>` を優先。
  - 拡張なし → `contents/<link>.md` → `contents/<link>/index.md` → `.mdx`も同様に試行。
  - 見つからなければ未設定（リンクは生成するが、ビルド/表示時にスキップ可）。
- `home.md` は `slug: home` として扱う（現行UIと整合）。
- リンク無しの見出しは「クリック不可フォルダ」として保持（必要ならスキップへ切替可能）。

## ページ解決（getDetailedContentBySlug 代替）

- 入力`slug`に対し、sitemapフラットリストで以下の順に検索:
  1) 完全一致（`entry.slug === slug`）
  2) リーフ一致（`entry.slug.split('/').pop() === leaf`）
  3) ファイルシステム推測（`contents/<slug>.md` → `contents/<slug>/index.md` → `.mdx`）
- 見つかった`filepath`で`loadMarkdownContent`を実行。`published: false`は404に。

## 前後ナビ（sitemap順）

- ツリーをpre-orderでフラット化し、`filepath`を持つ項目のみ対象に並べる。
- 現在ページのインデックスを基準に前後を決定し、URLは `/${slug}` を返却。

## 静的生成（generateStaticParams）

- sitemapフラットリストから `slug.split('/')` を `slug[]` として収集。
- `filepath` が存在し実ファイルがあるもののみ含める。

## 検索APIのURL解決

- `getSiteCsv` を `getSiteSitemap` に置換:
  - `byFilepath: Map<relativeFile, fullSlug>`
  - `byLeafSlug: Map<leaf, fullSlug>`
- Compiled MDXの`page.path`から`siteId`/`relativeFilePath`を取得し、上記マップでフルスラッグに解決。
- 解決不可時は、拡張除去した擬似スラッグでフォールバック。

## Sidebar（documentationテーマ）

- `loadSitemapEntries()` を新設し、ナビとしてそのまま渡す。
- 既存の`convertToPageTree`でURL化（先頭に自動`/`）。

## ブログのCSV依存置換

- `ContentManager.loadContentDirectory(techKeywordId)` を用い、`frontmatter.post_type === 'post'` を抽出。
- タグ/カテゴリ/featured/日付ソートはfrontmatterベースで実装。

## 実装手順

1) `src/lib/content-loader.ts`
   - `loadSitemapEntries()` 追加（パース＋正規化＋キャッシュ）
   - `getDetailedContentBySlug()`/`getPreviousAndNextPage()` をsitemapベースへ置換
   - `getHomeContent()`は`contents/home.md`直読み（sitemapと独立）
2) `src/app/sites/[techKeywordId]/page.tsx`
   - ナビ生成を`loadSitemapEntries()`へ切替
3) `src/app/sites/[techKeywordId]/[...slug]/page.tsx`
   - ナビ生成・前後ナビ・静的生成をsitemapベースへ置換
4) `src/app/api/search/route.ts`
   - CSVキャッシュ → sitemapキャッシュに置換
5) `src/lib/blog-data.ts`
   - CSV依存をFS走査＋frontmatterへ移行

## 確認項目

- Sidebarの順序・階層が `specs/sitemap.md` と一致。
- 各リンクが `/sites/[siteid]/<slug>` で表示・TOC・前後ナビが正常。
- 静的生成がsitemap上の全ページを網羅（存在ファイルのみ）。
- 検索結果のURLが正しくスラッグへ変換（アンカー・`?q=`付与も維持）。
- sitemap不備時も最低限のフォールバック（FS推測）が動作。

