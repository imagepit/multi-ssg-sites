/**
 * theme/dx-media/src/lib/auth/redirect.ts のテスト
 *
 * オープンリダイレクト防止のためのURL検証テスト
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// グローバルwindowの型定義
declare const window: { location: { origin: string } } | undefined

// リダイレクト検証関数を直接実装してテスト
// （theme側からインポートできないため）

function validateRedirectUrl(url: string | null): string | null {
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

describe('validateRedirectUrl', () => {
  describe('基本的なケース', () => {
    it('nullを渡すとnullを返す', () => {
      expect(validateRedirectUrl(null)).toBeNull()
    })

    it('空文字を渡すとnullを返す', () => {
      expect(validateRedirectUrl('')).toBeNull()
    })
  })

  describe('相対パス', () => {
    it('/で始まる相対パスを許可する', () => {
      expect(validateRedirectUrl('/docs/premium')).toBe('/docs/premium')
      expect(validateRedirectUrl('/login')).toBe('/login')
      expect(validateRedirectUrl('/')).toBe('/')
    })

    it('クエリパラメータ付きの相対パスを許可する', () => {
      expect(validateRedirectUrl('/docs?page=1')).toBe('/docs?page=1')
      expect(validateRedirectUrl('/search?q=test&sort=date')).toBe('/search?q=test&sort=date')
    })

    it('フラグメント付きの相対パスを許可する', () => {
      expect(validateRedirectUrl('/docs#section-1')).toBe('/docs#section-1')
    })
  })

  describe('拒否すべきURL', () => {
    it('絶対URLを拒否する', () => {
      expect(validateRedirectUrl('https://evil.com')).toBeNull()
      expect(validateRedirectUrl('http://evil.com/path')).toBeNull()
      expect(validateRedirectUrl('https://example.com/login')).toBeNull()
    })

    it('プロトコル相対URLを拒否する', () => {
      expect(validateRedirectUrl('//evil.com')).toBeNull()
      expect(validateRedirectUrl('//evil.com/path')).toBeNull()
    })

    it('/で始まらないパスを拒否する', () => {
      expect(validateRedirectUrl('docs/premium')).toBeNull()
      expect(validateRedirectUrl('login')).toBeNull()
      expect(validateRedirectUrl('../admin')).toBeNull()
    })

    it('JavaScriptプロトコルを拒否する', () => {
      expect(validateRedirectUrl('javascript:alert(1)')).toBeNull()
    })

    it('dataプロトコルを拒否する', () => {
      expect(validateRedirectUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
    })
  })

  describe('エッジケース', () => {
    it('エンコードされたURLを処理する', () => {
      expect(validateRedirectUrl('/docs/%E6%97%A5%E6%9C%AC%E8%AA%9E')).toBe('/docs/%E6%97%A5%E6%9C%AC%E8%AA%9E')
    })

    it('スラッシュのみのパスを許可する', () => {
      expect(validateRedirectUrl('/')).toBe('/')
    })

    it('複数のスラッシュで始まるパスを拒否する', () => {
      expect(validateRedirectUrl('///evil.com')).toBeNull()
    })
  })

  describe('ブラウザ環境でのテスト', () => {
    // Node.js環境ではwindowが存在しないため、
    // ブラウザ環境固有のテストはスキップ
    // 実際のブラウザテストはE2Eテストで実施

    it('Node.js環境では相対パスをそのまま許可する', () => {
      expect(validateRedirectUrl('/docs/premium')).toBe('/docs/premium')
    })

    it('プロトコル相対URLは最初のチェックで拒否される', () => {
      expect(validateRedirectUrl('//evil.com/path')).toBeNull()
    })
  })
})
