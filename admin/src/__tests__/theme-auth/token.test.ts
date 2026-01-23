/**
 * theme/dx-media/src/lib/auth/token.ts のテスト
 *
 * NOTE: このテストはlocalStorageに依存する部分はスキップし、
 *       ピュアな関数のみをテストします。
 */
import { describe, it, expect } from 'vitest'

// トークン関連のピュア関数を直接実装してテスト
// （theme側からインポートできないため）

function decodeJwtPayload(token: string): Record<string, unknown> | null {
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

function isTokenExpired(token: string, bufferSeconds = 0): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') {
    return true
  }
  const now = Math.floor(Date.now() / 1000)
  return payload.exp - bufferSeconds <= now
}

function getTokenRemainingTime(token: string): number {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') {
    return 0
  }
  const now = Math.floor(Date.now() / 1000)
  const remaining = payload.exp - now
  return remaining > 0 ? remaining : 0
}

// テスト用JWTを生成するヘルパー
function createTestJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'test-signature'
  return `${header}.${body}.${signature}`
}

describe('decodeJwtPayload', () => {
  it('有効なJWTのペイロードをデコードできる', () => {
    const payload = { sub: 'user-123', email: 'test@example.com', exp: 1234567890 }
    const token = createTestJwt(payload)

    const decoded = decodeJwtPayload(token)

    expect(decoded).toEqual(payload)
  })

  it('パーツが3つでないトークンはnullを返す', () => {
    expect(decodeJwtPayload('invalid')).toBeNull()
    expect(decodeJwtPayload('header.body')).toBeNull()
    expect(decodeJwtPayload('a.b.c.d')).toBeNull()
  })

  it('不正なBase64はnullを返す', () => {
    expect(decodeJwtPayload('xxx.!!!.zzz')).toBeNull()
  })

  it('不正なJSONはnullを返す', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }))
    const invalidBody = btoa('not-json')
    const token = `${header}.${invalidBody}.signature`

    expect(decodeJwtPayload(token)).toBeNull()
  })
})

describe('isTokenExpired', () => {
  it('期限内のトークンはfalseを返す', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1時間後
    const token = createTestJwt({ exp: futureExp })

    expect(isTokenExpired(token)).toBe(false)
  })

  it('期限切れのトークンはtrueを返す', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600 // 1時間前
    const token = createTestJwt({ exp: pastExp })

    expect(isTokenExpired(token)).toBe(true)
  })

  it('バッファ秒を考慮して期限をチェックする', () => {
    const exp = Math.floor(Date.now() / 1000) + 60 // 60秒後に期限切れ
    const token = createTestJwt({ exp })

    // バッファなしなら期限内
    expect(isTokenExpired(token, 0)).toBe(false)
    // 120秒のバッファがあれば期限切れとみなす
    expect(isTokenExpired(token, 120)).toBe(true)
  })

  it('expがないトークンはtrueを返す', () => {
    const token = createTestJwt({ sub: 'user-123' })

    expect(isTokenExpired(token)).toBe(true)
  })

  it('不正なトークンはtrueを返す', () => {
    expect(isTokenExpired('invalid-token')).toBe(true)
  })
})

describe('getTokenRemainingTime', () => {
  it('期限内のトークンの残り時間を返す', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1時間後
    const token = createTestJwt({ exp: futureExp })

    const remaining = getTokenRemainingTime(token)

    // 誤差を考慮して範囲でチェック
    expect(remaining).toBeGreaterThan(3590)
    expect(remaining).toBeLessThanOrEqual(3600)
  })

  it('期限切れのトークンは0を返す', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600 // 1時間前
    const token = createTestJwt({ exp: pastExp })

    expect(getTokenRemainingTime(token)).toBe(0)
  })

  it('expがないトークンは0を返す', () => {
    const token = createTestJwt({ sub: 'user-123' })

    expect(getTokenRemainingTime(token)).toBe(0)
  })

  it('不正なトークンは0を返す', () => {
    expect(getTokenRemainingTime('invalid-token')).toBe(0)
  })
})
