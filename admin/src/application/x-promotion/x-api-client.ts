/**
 * X (Twitter) API client interface
 */

export interface XOAuthConfig {
  clientId: string
  clientSecret: string
  callbackUrl: string
}

export interface XOAuthStartResult {
  authorizationUrl: string
  state: string
  codeVerifier: string
}

export interface XOAuthTokenResult {
  accessToken: string
  refreshToken: string
  expiresIn: number // seconds
  scope: string
}

export interface XUserInfo {
  id: string
  username: string
  name: string
}

export interface XRepostCheckResult {
  hasReposted: boolean
  repostId?: string
}

export interface XApiClient {
  /**
   * Generate OAuth 2.0 authorization URL with PKCE
   */
  startOAuthFlow(state: string): Promise<XOAuthStartResult>

  /**
   * Exchange authorization code for tokens
   */
  exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<XOAuthTokenResult>

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(refreshToken: string): Promise<XOAuthTokenResult>

  /**
   * Get authenticated user info
   */
  getUserInfo(accessToken: string): Promise<XUserInfo>

  /**
   * Check if user has reposted a specific tweet
   */
  checkRepost(
    accessToken: string,
    userId: string,
    tweetId: string
  ): Promise<XRepostCheckResult>
}
