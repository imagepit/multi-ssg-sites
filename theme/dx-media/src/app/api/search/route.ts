import { NextRequest } from 'next/server'
import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'
import path from 'node:path'

// Lightweight Japanese tokenizer using Intl.Segmenter (fallback-friendly)
function createJapaneseTokenizer() {
  const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter
    ? new (Intl as any).Segmenter('ja', { granularity: 'word' })
    : null

  const normalize = (token: string) => token.toLowerCase()

  const tokenize = function (this: any, input: unknown, _language?: unknown, prop?: string): string[] {
    if (typeof input !== 'string') return [String(input ?? '')]
    // Allow opt-out per property
    if (prop && this?.tokenizeSkipProperties?.has?.(prop)) {
      return [normalize(input)]
    }
    if (!segmenter) {
      // Fallback: split by whitespace + CJK char-wise
      const words = input
        .split(/\s+/)
        .flatMap((w) => (/[\u3040-\u30ff\u3400-\u9fff]/.test(w) ? w.split('') : [w]))
        .filter(Boolean)
      return words.map(normalize)
    }
    const it = (segmenter as any).segment(input)
    const out: string[] = []
    for (const seg of it) {
      if ((seg as any).isWordLike && (seg as any).segment) out.push(normalize((seg as any).segment))
    }
    const trimmed = out.filter(Boolean)
    return Array.from(new Set(trimmed))
  }

  return {
    language: 'japanese',
    tokenize,
    normalizeToken: (_prop: string, token: string, _withCache?: boolean) => normalize(token),
    tokenizeSkipProperties: new Set<string>(),
    stemmerSkipProperties: new Set<string>(),
    stopWords: undefined as string[] | undefined,
    allowDuplicates: false,
    normalizationCache: new Map<string, string>(),
  }
}

// SSGエクスポート時もエラーを避けるため、デフォルトではautoに設定
// 開発・本番サーバーでは自動的に動的ルートとして動作する
export const dynamic = 'auto'
export const revalidate = false

// SSGエクスポート時はAPIを初期化しない
let api: ReturnType<typeof createFromSource> | null = null

function getAPI() {
  if (api) return api
  if (process.env.SSG_EXPORT === '1') return null

  api = createFromSource(source, {
    tokenizer: createJapaneseTokenizer() as any,
    async buildIndex(page) {
      const data: any = page.data

      // Derive title/description
      const titleBase = path.basename(page.path || '', path.extname(page.path || ''))
      const title: string = (data?.title ?? titleBase) || 'Untitled'
      const description: string | undefined = 'description' in (data || {}) ? data?.description : undefined

      // Extract structured data for headings/contents when available
      let structuredData: any | undefined

      if (data && 'structuredData' in data) {
        structuredData = data.structuredData
      } else if (data && typeof data.load === 'function') {
        try {
          const loaded = await data.load()
          structuredData = loaded?.structuredData
        } catch (e) {
          console.error('[buildIndex] Failed to load structuredData:', e)
        }
      }

      // If structuredData is not available, fall back to full-text content
      if (!structuredData || (!structuredData.headings?.length && !structuredData.contents?.length)) {
        try {
          const rawContent = await page.data.getText('raw')
          structuredData = {
            headings: [],
            contents: rawContent ? [{ heading: title, content: rawContent }] : [],
          }
        } catch (e) {
          console.error('[buildIndex] Failed to get raw text:', e)
          structuredData = { headings: [], contents: [] }
        }
      }

      return {
        id: page.url,
        title,
        description,
        url: page.url,
        structuredData,
      }
    },
  })

  return api
}

function appendQueryParam(url: string, key: string, value: string): string {
  if (!value) return url
  const [pathOnly, hash] = url.split('#', 2)
  const sep = pathOnly.includes('?') ? '&' : '?'
  const updated = `${pathOnly}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  return hash ? `${updated}#${hash}` : updated
}

export async function GET(req: NextRequest) {
  const searchAPI = getAPI()

  if (!searchAPI) {
    // SSGエクスポート時またはAPI初期化失敗時
    return Response.json([])
  }

  const { searchParams } = { searchParams: req.nextUrl.searchParams }

  // Fumadocsは 'query' パラメータを使用
  const query = (searchParams.get('query') || searchParams.get('q') || '').trim()

  if (!query) {
    return Response.json([])
  }

  const locale = searchParams.get('locale') || undefined
  const mode = searchParams.get('mode') === 'vector' ? 'vector' : 'full'

  const results = await searchAPI.search(query, { locale, mode })

  const normalized = Array.isArray(results)
    ? results.map((r) => ({ ...r, url: appendQueryParam(r.url, 'q', query) }))
    : []

  return Response.json(normalized)
}