# 静的検索（Option B）実装ガイド

本ドキュメントは、API ルートを使わずにクライアントのみで完結する「静的検索」を導入する手順です。Cloudflare Pages などの完全静的ホスティングでも 404 を回避できます。

## 1. インデックス生成

ビルド時に Markdown コンテンツから検索用 JSON を生成します。

- スクリプト: `scripts/build-search-index.mjs`
- 入力: `specs/page.csv` と `contents/**/**.md`
- 出力: `public/search-index/langchain.json`（および `langchain.meta.json`）

実行例:

```
node scripts/build-search-index.mjs \
  --csv specs/page.csv \
  --contents contents \
  --site langchain \
  --out public/search-index/langchain.json \
  --base "/langchain"
```

補足:
- `--base` はサイトの公開パスに合わせて変更してください。ルート配信なら `"/"` を指定します。
- 生成物は静的ファイルなので、そのままホスティングにアップロードできます。

## 2. フロントエンド連携（Next.js ドキュメントテーマ）

API `/api/search` を呼ばず、JSON を直接取得してクライアントで検索します。検索ライブラリは `minisearch` などを利用すると軽量です。

### 2.1 依存追加（Next.js 側）

```
pnpm add minisearch
```

### 2.2 検索フックの追加（例）

`src/themes/documentation/lib/useStaticSearch.ts`（例）

```ts
import MiniSearch from 'minisearch'

type Doc = {
  id: string
  site: string
  title: string
  url: string
  content: string
}

export function createSearchIndex(docs: Doc[]) {
  const mini = new MiniSearch({
    fields: ['title', 'content'], // 検索対象
    storeFields: ['title', 'url'], // 返却時に保持
    searchOptions: { fuzzy: 0.2, prefix: true },
  })
  mini.addAll(docs)
  return mini
}

export async function loadIndex(site: string) {
  const res = await fetch(`/search-index/${site}.json`)
  if (!res.ok) throw new Error('search index not found')
  const json = await res.json()
  const index = createSearchIndex(json.docs)
  return { index, meta: { site: json.site, count: json.count } }
}
```

### 2.3 検索 UI での使用（例）

`src/themes/documentation/components/Search.tsx`（例）

```tsx
import { useEffect, useMemo, useState } from 'react'
import { loadIndex } from '../lib/useStaticSearch'

export default function Search({ site }: { site: string }) {
  const [ready, setReady] = useState(false)
  const [engine, setEngine] = useState<any>(null)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    loadIndex(site).then(({ index }) => { setEngine(index); setReady(true) })
      .catch(() => setReady(false))
  }, [site])

  useEffect(() => {
    if (!engine) return
    if (!q) { setResults([]); return }
    const r = engine.search(q)
    setResults(r.map((x: any) => ({ title: x.title, url: x.url })))
  }, [q, engine])

  return (
    <div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="検索" />
      {!ready && <div>検索を初期化中...</div>}
      {ready && results.length > 0 && (
        <ul>
          {results.map((r, i) => (
            <li key={i}><a href={r.url}>{r.title}</a></li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 2.4 参照先の置き換え

- 旧: `fetch('/api/search?site=...&query=...')`
- 新: `fetch('/search-index/<site>.json')` を初期化時に 1 回だけ実行し、以降はクライアントで全文検索。

## 3. デプロイへの組み込み

1. ビルド前に検索インデックスを生成
   - 例: `deploy.sh` のビルド直前に以下を追加
     ```bash
     node scripts/build-search-index.mjs \
       --csv specs/page.csv \
       --contents contents \
       --site langchain \
       --out public/search-index/langchain.json \
       --base "/langchain"
     ```
2. 静的ホスティングに `public/search-index/**` を含めてアップロード
3. フロントエンドは `/search-index/langchain.json` を取得して検索エンジンを初期化

## 4. トラブルシューティング

- 404 が出る: 生成物が配備されていない、またはパスがずれている可能性があります。`/search-index/langchain.json` に直接アクセスして 200 を確認してください。
- 検索ヒットが少ない: `stripMarkdown` のルールが強すぎる可能性。`scripts/build-search-index.mjs` の正規表現を調整してください。
- URL がずれる: `--base` を実際の公開パスに合わせて調整してください。

