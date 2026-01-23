/**
 * リダイレクトURL検証（オープンリダイレクト防止）
 */

/**
 * リダイレクト先URLの検証
 * @param url 検証対象のURL
 * @returns 安全なURLの場合はそのURL、危険な場合はnull
 */
export function validateRedirectUrl(url: string | null): string | null {
  if (!url) return null

  // 相対パスのみ許可（/で始まる、//で始まらない）
  if (!url.startsWith('/') || url.startsWith('//')) {
    return null
  }

  // プロトコル相対URLの除外
  if (typeof window !== 'undefined') {
    try {
      const parsed = new URL(url, window.location.origin)
      if (parsed.origin !== window.location.origin) {
        return null
      }
    } catch {
      return null
    }
  }

  return url
}
