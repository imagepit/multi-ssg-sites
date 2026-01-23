import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { XApiClientImpl } from './x-api-client-impl.js'
import type { XOAuthConfig } from '../../application/x-promotion/x-api-client.js'

const mockConfig: XOAuthConfig = {
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  callbackUrl: 'https://example.com/api/x/auth/callback',
}

describe('XApiClientImpl', () => {
  let client: XApiClientImpl
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    client = new XApiClientImpl(mockConfig)
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('startOAuthFlow', () => {
    it('generates authorization URL with PKCE parameters', async () => {
      const result = await client.startOAuthFlow('test-state')

      expect(result.state).toBe('test-state')
      expect(result.codeVerifier).toBeDefined()
      expect(result.codeVerifier.length).toBeGreaterThan(0)
      expect(result.authorizationUrl).toContain('https://twitter.com/i/oauth2/authorize')
      expect(result.authorizationUrl).toContain('client_id=test-client-id')
      expect(result.authorizationUrl).toContain('state=test-state')
      expect(result.authorizationUrl).toContain('code_challenge=')
      expect(result.authorizationUrl).toContain('code_challenge_method=S256')
      expect(result.authorizationUrl).toContain('scope=')
    })
  })

  describe('exchangeCodeForTokens', () => {
    it('exchanges code for tokens successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_in: 7200,
            scope: 'tweet.read users.read',
          }),
      })

      const result = await client.exchangeCodeForTokens('auth-code', 'code-verifier')

      expect(result.accessToken).toBe('new-access-token')
      expect(result.refreshToken).toBe('new-refresh-token')
      expect(result.expiresIn).toBe(7200)
      expect(result.scope).toBe('tweet.read users.read')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.twitter.com/2/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      )
    })

    it('throws error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Invalid code'),
      })

      await expect(client.exchangeCodeForTokens('bad-code', 'verifier')).rejects.toThrow(
        'Failed to exchange code for tokens'
      )
    })
  })

  describe('refreshAccessToken', () => {
    it('refreshes token successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'refreshed-access-token',
            refresh_token: 'refreshed-refresh-token',
            expires_in: 7200,
            scope: 'tweet.read users.read',
          }),
      })

      const result = await client.refreshAccessToken('old-refresh-token')

      expect(result.accessToken).toBe('refreshed-access-token')
      expect(result.refreshToken).toBe('refreshed-refresh-token')
    })

    it('throws error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Invalid refresh token'),
      })

      await expect(client.refreshAccessToken('bad-token')).rejects.toThrow(
        'Failed to refresh access token'
      )
    })
  })

  describe('getUserInfo', () => {
    it('returns user info successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              id: '12345678901234567',
              username: 'testuser',
              name: 'Test User',
            },
          }),
      })

      const result = await client.getUserInfo('access-token')

      expect(result.id).toBe('12345678901234567')
      expect(result.username).toBe('testuser')
      expect(result.name).toBe('Test User')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.twitter.com/2/users/me',
        expect.objectContaining({
          headers: { Authorization: 'Bearer access-token' },
        })
      )
    })

    it('throws error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Unauthorized'),
      })

      await expect(client.getUserInfo('bad-token')).rejects.toThrow('Failed to get user info')
    })
  })

  describe('checkRepost', () => {
    it('returns true when user has reposted', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { id: '12345678901234567' },
              { id: '99999999999999999' },
            ],
            meta: { result_count: 2 },
          }),
      })

      const result = await client.checkRepost(
        'access-token',
        '12345678901234567',
        '1881632785927586250'
      )

      expect(result.hasReposted).toBe(true)
      expect(result.repostId).toBe('repost:12345678901234567:1881632785927586250')
    })

    it('returns false when user has not reposted', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [{ id: '99999999999999999' }],
            meta: { result_count: 1 },
          }),
      })

      const result = await client.checkRepost(
        'access-token',
        '12345678901234567',
        '1881632785927586250'
      )

      expect(result.hasReposted).toBe(false)
      expect(result.repostId).toBeUndefined()
    })

    it('returns false when no one has reposted', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meta: { result_count: 0 },
          }),
      })

      const result = await client.checkRepost(
        'access-token',
        '12345678901234567',
        '1881632785927586250'
      )

      expect(result.hasReposted).toBe(false)
    })

    it('returns false on 404 (tweet not found)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not found'),
      })

      const result = await client.checkRepost(
        'access-token',
        '12345678901234567',
        'nonexistent-tweet'
      )

      expect(result.hasReposted).toBe(false)
    })

    it('throws error on other failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server error'),
      })

      await expect(
        client.checkRepost('access-token', '12345678901234567', '1881632785927586250')
      ).rejects.toThrow('Failed to check repost')
    })
  })
})
