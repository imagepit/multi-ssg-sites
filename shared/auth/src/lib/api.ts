/**
 * 認証APIクライアント
 */

import type { TokenPair, VerifyResponse, RefreshResponse, RequestLinkResponse, User } from './types'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './token'

let apiBaseUrl = ''

/**
 * API ベース URL を設定
 */
export function setApiBaseUrl(url: string): void {
  apiBaseUrl = url
}

/**
 * API ベース URL を取得
 */
export function getApiBaseUrl(): string {
  return apiBaseUrl
}

/**
 * リフレッシュ中のPromiseを共有して競合防止
 */
let refreshPromise: Promise<TokenPair> | null = null

/**
 * マジックリンク送信リクエスト
 */
export async function requestMagicLink(
  email: string,
  next?: string
): Promise<RequestLinkResponse> {
  // フロントエンドのコールバックURLを構築
  const callbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : undefined

  const response = await fetch(`${apiBaseUrl}/auth/request_link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      callbackUrl,
      next,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'マジックリンクの送信に失敗しました')
  }

  return response.json()
}

/**
 * マジックリンク検証・JWT取得
 */
export async function verifyMagicLink(token: string): Promise<VerifyResponse> {
  const response = await fetch(`${apiBaseUrl}/auth/verify?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '認証に失敗しました')
  }

  return response.json()
}

/**
 * アクセストークンをリフレッシュ
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'トークンのリフレッシュに失敗しました')
  }

  return response.json()
}

/**
 * 現在のユーザー情報を取得
 */
export async function fetchCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${apiBaseUrl}/auth/whoami`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'ユーザー情報の取得に失敗しました')
  }

  return response.json()
}

/**
 * 必要に応じてトークンをリフレッシュ（競合制御付き）
 */
export async function refreshTokenIfNeeded(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('リフレッシュトークンがありません')
  }

  // 既にリフレッシュ中なら待機
  if (refreshPromise) {
    const tokens = await refreshPromise
    return tokens.accessToken
  }

  refreshPromise = (async (): Promise<TokenPair> => {
    try {
      const result = await refreshAccessToken(refreshToken)
      const tokens: TokenPair = {
        accessToken: result.accessToken,
        refreshToken: refreshToken, // リフレッシュトークンは再利用
      }
      saveTokens(tokens)
      return tokens
    } finally {
      refreshPromise = null
    }
  })()

  const tokens = await refreshPromise
  return tokens.accessToken
}

/**
 * 認証付きfetch（401時に自動リフレッシュ→リトライ）
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  let accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error('認証が必要です')
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (response.status === 401) {
    try {
      accessToken = await refreshTokenIfNeeded()
      response = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    } catch {
      // リフレッシュ失敗時はトークンをクリア
      clearTokens()
      throw new Error('セッションが切れました。再度ログインしてください')
    }
  }

  return response
}
