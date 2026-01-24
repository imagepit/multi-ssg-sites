import * as fs from 'node:fs'
import * as path from 'node:path'
import * as crypto from 'node:crypto'

/**
 * OGP情報の型定義
 */
export interface OgpData {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
  fetchedAt: number
}

/**
 * OGP取得オプション
 */
export interface OgpFetcherOptions {
  /** キャッシュディレクトリ（デフォルト: .cache/ogp） */
  cacheDir?: string
  /** キャッシュ有効期限（ミリ秒、デフォルト: 7日） */
  cacheTtl?: number
  /** タイムアウト（ミリ秒、デフォルト: 5000） */
  timeout?: number
  /** 最大リダイレクト回数（デフォルト: 3） */
  maxRedirects?: number
  /** 最大レスポンスサイズ（バイト、デフォルト: 1MB） */
  maxResponseSize?: number
  /** 並列取得数（デフォルト: 5） */
  concurrency?: number
}

const DEFAULT_OPTIONS: Required<OgpFetcherOptions> = {
  cacheDir: '.cache/ogp',
  cacheTtl: 7 * 24 * 60 * 60 * 1000, // 7日
  timeout: 5000,
  maxRedirects: 3,
  maxResponseSize: 1024 * 1024, // 1MB
  concurrency: 5,
}

/**
 * プライベートIPアドレスかどうかを判定
 */
function isPrivateIP(hostname: string): boolean {
  // localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true
  }

  // IPv4プライベートIP
  const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number)
    // 10.0.0.0/8
    if (a === 10) return true
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true
    // 169.254.0.0/16 (link-local)
    if (a === 169 && b === 254) return true
    // 127.0.0.0/8
    if (a === 127) return true
  }

  return false
}

/**
 * URLの安全性を検証
 */
function validateUrl(urlString: string): URL {
  const url = new URL(urlString)

  // http/httpsのみ許可
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Invalid protocol: ${url.protocol}`)
  }

  // プライベートIPをブロック
  if (isPrivateIP(url.hostname)) {
    throw new Error(`Private IP not allowed: ${url.hostname}`)
  }

  return url
}

/**
 * URLからキャッシュファイルパスを生成
 */
function getCachePath(url: string, cacheDir: string): string {
  const hash = crypto.createHash('md5').update(url).digest('hex')
  return path.join(cacheDir, `${hash}.json`)
}

/**
 * キャッシュからOGPデータを読み込み
 */
function readCache(cachePath: string, ttl: number): OgpData | null {
  try {
    if (!fs.existsSync(cachePath)) {
      return null
    }

    const content = fs.readFileSync(cachePath, 'utf-8')
    const data = JSON.parse(content) as OgpData

    // 期限切れチェック
    if (Date.now() - data.fetchedAt > ttl) {
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * OGPデータをキャッシュに書き込み
 */
function writeCache(cachePath: string, data: OgpData): void {
  try {
    const dir = path.dirname(cachePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2))
  } catch {
    // キャッシュ書き込み失敗は無視
  }
}

/**
 * HTMLからOGPメタタグを抽出
 */
function parseOgpFromHtml(html: string, url: string): Omit<OgpData, 'fetchedAt'> {
  const result: Omit<OgpData, 'fetchedAt'> = { url }

  // og:title
  const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
  if (titleMatch) {
    result.title = decodeHtmlEntities(titleMatch[1])
  } else {
    // フォールバック: <title>タグ
    const fallbackTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (fallbackTitle) {
      result.title = decodeHtmlEntities(fallbackTitle[1])
    }
  }

  // og:description
  const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)
  if (descMatch) {
    result.description = decodeHtmlEntities(descMatch[1])
  } else {
    // フォールバック: meta description
    const fallbackDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
    if (fallbackDesc) {
      result.description = decodeHtmlEntities(fallbackDesc[1])
    }
  }

  // og:image
  const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (imageMatch) {
    result.image = resolveUrl(imageMatch[1], url)
  }

  // og:site_name
  const siteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i)
  if (siteNameMatch) {
    result.siteName = decodeHtmlEntities(siteNameMatch[1])
  }

  // favicon
  const faviconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i)
  if (faviconMatch) {
    result.favicon = resolveUrl(faviconMatch[1], url)
  } else {
    // デフォルトfavicon
    try {
      const urlObj = new URL(url)
      result.favicon = `${urlObj.origin}/favicon.ico`
    } catch {
      // ignore
    }
  }

  return result
}

/**
 * HTMLエンティティをデコード
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

/**
 * 相対URLを絶対URLに変換
 */
function resolveUrl(relative: string, base: string): string {
  try {
    return new URL(relative, base).href
  } catch {
    return relative
  }
}

/**
 * 単一URLのOGP情報を取得
 */
export async function fetchOgp(
  urlString: string,
  options: OgpFetcherOptions = {}
): Promise<OgpData> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // キャッシュチェック
  const cachePath = getCachePath(urlString, opts.cacheDir)
  const cached = readCache(cachePath, opts.cacheTtl)
  if (cached) {
    return cached
  }

  try {
    // URL検証
    const url = validateUrl(urlString)

    // fetch with timeout and redirect limit
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

    let response: Response
    let redirectCount = 0
    let currentUrl = url.href

    try {
      while (redirectCount <= opts.maxRedirects) {
        response = await fetch(currentUrl, {
          signal: controller.signal,
          redirect: 'manual',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; OGPFetcher/1.0)',
            'Accept': 'text/html,application/xhtml+xml',
          },
        })

        // リダイレクト処理
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location')
          if (!location) break

          currentUrl = resolveUrl(location, currentUrl)
          // リダイレクト先もプライベートIPチェック
          validateUrl(currentUrl)
          redirectCount++
          continue
        }

        break
      }
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response!.ok) {
      throw new Error(`HTTP ${response!.status}`)
    }

    // Content-Lengthチェック
    const contentLength = response!.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > opts.maxResponseSize) {
      throw new Error('Response too large')
    }

    // HTMLを取得（サイズ制限付き）
    const reader = response!.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const chunks: Uint8Array[] = []
    let totalSize = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalSize += value.length
      if (totalSize > opts.maxResponseSize) {
        reader.cancel()
        throw new Error('Response too large')
      }

      chunks.push(value)
    }

    const html = new TextDecoder().decode(Buffer.concat(chunks))

    // OGPパース
    const ogpData: OgpData = {
      ...parseOgpFromHtml(html, currentUrl),
      fetchedAt: Date.now(),
    }

    // キャッシュ保存
    writeCache(cachePath, ogpData)

    return ogpData
  } catch (error) {
    // エラー時はフォールバックデータを返す
    const fallbackData: OgpData = {
      url: urlString,
      fetchedAt: Date.now(),
    }

    // ホスト名だけは抽出を試みる
    try {
      const urlObj = new URL(urlString)
      fallbackData.siteName = urlObj.hostname
      fallbackData.favicon = `${urlObj.origin}/favicon.ico`
    } catch {
      // ignore
    }

    // フォールバックもキャッシュ（短い期間）
    writeCache(cachePath, fallbackData)

    return fallbackData
  }
}

/**
 * 複数URLのOGP情報を並列取得（重複排除、並列数制限付き）
 */
export async function fetchOgpBatch(
  urls: string[],
  options: OgpFetcherOptions = {}
): Promise<Map<string, OgpData>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // 重複排除
  const uniqueUrls = [...new Set(urls)]

  // 結果マップ
  const results = new Map<string, OgpData>()

  // 並列数制限付きで取得（ワーカー方式）
  let cursor = 0
  const workerCount = Math.min(opts.concurrency, uniqueUrls.length)

  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < uniqueUrls.length) {
      const url = uniqueUrls[cursor++]
      try {
        const data = await fetchOgp(url, opts)
        results.set(url, data)
      } catch {
        // 個別エラーは無視（fetchOgp内でフォールバック処理済み）
      }
    }
  })

  await Promise.all(workers)

  return results
}
