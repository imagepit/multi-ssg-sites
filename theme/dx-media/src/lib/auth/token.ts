/**
 * トークン管理（localStorage）
 */

import type { TokenPair } from './types'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

/**
 * トークンペアを localStorage に保存
 */
export function saveTokens(tokens: TokenPair): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

/**
 * アクセストークンを取得
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * リフレッシュトークンを取得
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * トークンを削除
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * JWTペイロードをデコード（署名検証なし、表示用）
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * トークンの有効期限をチェック
 * @param token JWTトークン
 * @param bufferSeconds 有効期限のバッファ秒数（デフォルト: 0）
 * @returns 期限切れの場合 true
 */
export function isTokenExpired(token: string, bufferSeconds = 0): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') {
    return true
  }
  const now = Math.floor(Date.now() / 1000)
  return payload.exp - bufferSeconds <= now
}

/**
 * トークンの残り有効期限を秒で取得
 * @returns 残り秒数、期限切れまたは不正なトークンの場合は0
 */
export function getTokenRemainingTime(token: string): number {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') {
    return 0
  }
  const now = Math.floor(Date.now() / 1000)
  const remaining = payload.exp - now
  return remaining > 0 ? remaining : 0
}
