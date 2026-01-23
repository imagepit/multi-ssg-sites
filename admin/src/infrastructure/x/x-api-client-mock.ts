import type {
  XApiClient,
  XOAuthStartResult,
  XOAuthTokenResult,
  XUserInfo,
  XRepostCheckResult,
} from '../../application/x-promotion/x-api-client.js'

/**
 * Mock implementation of XApiClient for development/testing
 * Always returns success for repost verification
 */
export class XApiClientMock implements XApiClient {
  async startOAuthFlow(state: string): Promise<XOAuthStartResult> {
    // Return a mock authorization URL that won't actually work
    // but the real OAuth flow is already working
    return {
      authorizationUrl: `https://twitter.com/i/oauth2/authorize?mock=true&state=${state}`,
      state,
      codeVerifier: 'mock-code-verifier',
    }
  }

  async exchangeCodeForTokens(
    _code: string,
    _codeVerifier: string
  ): Promise<XOAuthTokenResult> {
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 7200,
      scope: 'tweet.read users.read like.read offline.access',
    }
  }

  async refreshAccessToken(_refreshToken: string): Promise<XOAuthTokenResult> {
    return {
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token-refreshed',
      expiresIn: 7200,
      scope: 'tweet.read users.read like.read offline.access',
    }
  }

  async getUserInfo(_accessToken: string): Promise<XUserInfo> {
    return {
      id: 'mock-user-id',
      username: 'mock_user',
      name: 'Mock User',
    }
  }

  async checkRepost(
    _accessToken: string,
    userId: string,
    tweetId: string
  ): Promise<XRepostCheckResult> {
    // Always return success in mock mode
    console.log(`[MOCK] checkRepost called for user ${userId}, tweet ${tweetId} - returning success`)
    return {
      hasReposted: true,
      repostId: `mock-repost:${userId}:${tweetId}`,
    }
  }
}
