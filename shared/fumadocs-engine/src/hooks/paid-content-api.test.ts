import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  buildPaidContentUrl,
  createPaidContentError,
  fetchPaidContentSignedUrl,
  fetchContentFromR2,
  fetchPaidContent,
  isPaidContentError,
  type PaidContentError,
  type FetchPaidContentParams,
} from './paid-content-api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('paid-content-api', () => {
  const apiBaseUrl = 'https://api.example.com'
  const baseParams: FetchPaidContentParams = {
    siteId: 'site1',
    slug: 'ai/premium-content',
    sectionId: 'section-1',
    productId: 'product:course-1',
    apiBaseUrl,
    accessToken: 'test-token',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('buildPaidContentUrl', () => {
    it('should build correct URL with encoded parameters', () => {
      const url = buildPaidContentUrl(baseParams)

      expect(url).toBe(
        'https://api.example.com/api/paid-content?siteId=site1&slug=ai%2Fpremium-content&sectionId=section-1&productId=product%3Acourse-1'
      )
    })

    it('should handle special characters in slug', () => {
      const url = buildPaidContentUrl({
        ...baseParams,
        slug: 'docs/ai/advanced topics',
      })

      expect(url).toContain('slug=docs%2Fai%2Fadvanced+topics')
    })
  })

  describe('createPaidContentError', () => {
    it('should create unauthorized error for 401', () => {
      const error = createPaidContentError(401)
      expect(error).toEqual({
        type: 'unauthorized',
        message: 'ログインが必要です',
      })
    })

    it('should create unauthorized error for 401 with custom message', () => {
      const error = createPaidContentError(401, 'Token expired')
      expect(error).toEqual({
        type: 'unauthorized',
        message: 'Token expired',
      })
    })

    it('should create forbidden error for 403', () => {
      const error = createPaidContentError(403)
      expect(error).toEqual({
        type: 'forbidden',
        message: 'このコンテンツへのアクセス権がありません',
      })
    })

    it('should create not_found error for 404', () => {
      const error = createPaidContentError(404)
      expect(error).toEqual({
        type: 'not_found',
        message: 'コンテンツが見つかりません',
      })
    })

    it('should create network error for 500', () => {
      const error = createPaidContentError(500)
      expect(error).toEqual({
        type: 'network',
        message: 'サーバーエラー (500)',
      })
    })
  })

  describe('fetchPaidContentSignedUrl', () => {
    it('should fetch signed URL successfully', async () => {
      const mockResponse = {
        signedUrl: 'https://r2.example.com/content?signature=xxx',
        expiresAt: Date.now() + 3600000,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await fetchPaidContentSignedUrl(baseParams)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/paid-content'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
        })
      )
    })

    it('should throw unauthorized error for 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid token' }),
      })

      await expect(fetchPaidContentSignedUrl(baseParams)).rejects.toEqual({
        type: 'unauthorized',
        message: 'Invalid token',
      })
    })

    it('should throw forbidden error for 403', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Not purchased' }),
      })

      await expect(fetchPaidContentSignedUrl(baseParams)).rejects.toEqual({
        type: 'forbidden',
        message: 'Not purchased',
      })
    })

    it('should throw not_found error for 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })

      await expect(fetchPaidContentSignedUrl(baseParams)).rejects.toEqual({
        type: 'not_found',
        message: 'コンテンツが見つかりません',
      })
    })
  })

  describe('fetchContentFromR2', () => {
    it('should fetch content from R2 successfully', async () => {
      const mockContent = {
        html: '<h2>Premium Content</h2><p>This is paid content.</p>',
        updatedAt: Date.now(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContent),
      })

      const result = await fetchContentFromR2('https://r2.example.com/content?signature=xxx')

      expect(result).toEqual(mockContent)
    })

    it('should throw network error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(fetchContentFromR2('https://r2.example.com/content')).rejects.toEqual({
        type: 'network',
        message: 'コンテンツの取得に失敗しました',
      })
    })
  })

  describe('fetchPaidContent', () => {
    it('should fetch paid content end-to-end', async () => {
      const signedUrlResponse = {
        signedUrl: 'https://r2.example.com/content?signature=xxx',
        expiresAt: Date.now() + 3600000,
      }
      const contentResponse = {
        html: '<h2>Premium Content</h2>',
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(signedUrlResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(contentResponse),
        })

      const html = await fetchPaidContent(baseParams)

      expect(html).toBe('<h2>Premium Content</h2>')
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should propagate error from signed URL fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Not purchased' }),
      })

      await expect(fetchPaidContent(baseParams)).rejects.toEqual({
        type: 'forbidden',
        message: 'Not purchased',
      })
    })

    it('should propagate error from R2 fetch', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            signedUrl: 'https://r2.example.com/content?signature=xxx',
            expiresAt: Date.now() + 3600000,
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

      await expect(fetchPaidContent(baseParams)).rejects.toEqual({
        type: 'network',
        message: 'コンテンツの取得に失敗しました',
      })
    })
  })

  describe('isPaidContentError', () => {
    it('should return true for valid PaidContentError', () => {
      const errors: PaidContentError[] = [
        { type: 'unauthorized', message: 'test' },
        { type: 'forbidden', message: 'test' },
        { type: 'not_found', message: 'test' },
        { type: 'network', message: 'test' },
      ]

      errors.forEach((error) => {
        expect(isPaidContentError(error)).toBe(true)
      })
    })

    it('should return false for non-PaidContentError', () => {
      expect(isPaidContentError(null)).toBe(false)
      expect(isPaidContentError(undefined)).toBe(false)
      expect(isPaidContentError('string')).toBe(false)
      expect(isPaidContentError(new Error('test'))).toBe(false)
      expect(isPaidContentError({ type: 'unknown', message: 'test' })).toBe(false)
    })
  })
})
