import type {
  XApiClient,
  XOAuthConfig,
  XOAuthStartResult,
  XOAuthTokenResult,
  XUserInfo,
  XRepostCheckResult,
} from '../../application/x-promotion/x-api-client.js'

const X_AUTH_BASE_URL = 'https://twitter.com/i/oauth2'
const X_API_BASE_URL = 'https://api.twitter.com/2'

/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate code challenge from code verifier using SHA-256
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(digest))
}

/**
 * Base64 URL encode (RFC 4648)
 */
function base64UrlEncode(buffer: Uint8Array): string {
  let binary = ''
  for (const byte of buffer) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export class XApiClientImpl implements XApiClient {
  constructor(private readonly config: XOAuthConfig) {}

  async startOAuthFlow(state: string): Promise<XOAuthStartResult> {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      scope: 'tweet.read users.read like.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })

    const authorizationUrl = `${X_AUTH_BASE_URL}/authorize?${params.toString()}`

    return {
      authorizationUrl,
      state,
      codeVerifier,
    }
  }

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<XOAuthTokenResult> {
    const basicAuth = btoa(`${this.config.clientId}:${this.config.clientSecret}`)

    const response = await fetch(`${X_API_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.callbackUrl,
        code_verifier: codeVerifier,
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to exchange code for tokens: ${error}`)
    }

    const data = await response.json() as {
      access_token: string
      refresh_token: string
      expires_in: number
      scope: string
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<XOAuthTokenResult> {
    const basicAuth = btoa(`${this.config.clientId}:${this.config.clientSecret}`)

    const response = await fetch(`${X_API_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh access token: ${error}`)
    }

    const data = await response.json() as {
      access_token: string
      refresh_token: string
      expires_in: number
      scope: string
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
    }
  }

  async getUserInfo(accessToken: string): Promise<XUserInfo> {
    const response = await fetch(`${X_API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get user info: ${error}`)
    }

    const data = await response.json() as {
      data: {
        id: string
        username: string
        name: string
      }
    }

    return {
      id: data.data.id,
      username: data.data.username,
      name: data.data.name,
    }
  }

  async checkRepost(
    accessToken: string,
    userId: string,
    tweetId: string
  ): Promise<XRepostCheckResult> {
    // X API v2: Get user's retweets (requires tweet.read scope)
    // Note: X API doesn't have a direct endpoint to check if user reposted a specific tweet
    // We need to use the "Retweets lookup" endpoint
    const response = await fetch(
      `${X_API_BASE_URL}/tweets/${tweetId}/retweeted_by?user.fields=id`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      // If 404, tweet doesn't exist or user doesn't have access
      if (response.status === 404) {
        return { hasReposted: false }
      }
      const error = await response.text()
      throw new Error(`Failed to check repost: ${error}`)
    }

    const data = await response.json() as {
      data?: Array<{ id: string }>
      meta?: { result_count: number }
    }

    // Check if the user is in the list of users who retweeted
    const hasReposted = data.data?.some((user) => user.id === userId) ?? false

    // Note: X API doesn't return the repost ID directly
    // We use the tweet ID as a reference
    return {
      hasReposted,
      repostId: hasReposted ? `repost:${userId}:${tweetId}` : undefined,
    }
  }
}
