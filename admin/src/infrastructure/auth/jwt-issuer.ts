import type {
  TokenIssuer,
  TokenPayload,
  TokenPair
} from '../../application/auth/token-issuer.js'

interface JwtIssuerOptions {
  secret: string
  accessTokenExpiresIn?: number // seconds, default 3600 (1 hour)
  refreshTokenExpiresIn?: number // seconds, default 604800 (7 days)
}

export class JwtTokenIssuer implements TokenIssuer {
  private readonly secret: string
  private readonly accessTokenExpiresIn: number
  private readonly refreshTokenExpiresIn: number

  constructor(options: JwtIssuerOptions) {
    this.secret = options.secret
    this.accessTokenExpiresIn = options.accessTokenExpiresIn ?? 3600
    this.refreshTokenExpiresIn = options.refreshTokenExpiresIn ?? 604800
  }

  async issueAccessToken(payload: TokenPayload): Promise<string> {
    return this.issueToken(payload, this.accessTokenExpiresIn, 'access')
  }

  async issueRefreshToken(payload: TokenPayload): Promise<string> {
    return this.issueToken(payload, this.refreshTokenExpiresIn, 'refresh')
  }

  async issueTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(payload),
      this.issueRefreshToken(payload)
    ])

    return { accessToken, refreshToken }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('invalid token format')
    }

    const [headerB64, payloadB64, signatureB64] = parts

    // Verify signature
    const data = `${headerB64}.${payloadB64}`
    const signature = this.base64UrlDecode(signatureB64)
    const key = await this.getKey()

    const signatureBuffer = new Uint8Array(signature).buffer
    const isValid = await crypto.subtle.verify(
      { name: 'HMAC' },
      key,
      signatureBuffer,
      new TextEncoder().encode(data)
    )

    if (!isValid) {
      throw new Error('invalid signature')
    }

    // Decode and validate payload
    const payloadJson = new TextDecoder().decode(this.base64UrlDecode(payloadB64))
    const claims = JSON.parse(payloadJson)

    // Check token type
    if (claims.type !== 'refresh') {
      throw new Error('not a refresh token')
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (claims.exp && claims.exp < now) {
      throw new Error('token expired')
    }

    return {
      sub: claims.sub,
      email: claims.email,
      roles: claims.roles,
      siteIds: claims.siteIds
    }
  }

  private async issueToken(
    payload: TokenPayload,
    expiresIn: number,
    type: 'access' | 'refresh'
  ): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }

    const now = Math.floor(Date.now() / 1000)
    const claims = {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      siteIds: payload.siteIds,
      type,
      iat: now,
      exp: now + expiresIn
    }

    const headerB64 = this.base64UrlEncode(JSON.stringify(header))
    const payloadB64 = this.base64UrlEncode(JSON.stringify(claims))

    const data = `${headerB64}.${payloadB64}`
    const signature = await this.sign(data)
    const signatureB64 = this.base64UrlEncode(signature)

    return `${data}.${signatureB64}`
  }

  private async getKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )
  }

  private async sign(data: string): Promise<ArrayBuffer> {
    const key = await this.getKey()
    return crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(data)
    )
  }

  private base64UrlEncode(data: string | ArrayBuffer): string {
    let bytes: Uint8Array
    if (typeof data === 'string') {
      bytes = new TextEncoder().encode(data)
    } else {
      bytes = new Uint8Array(data)
    }

    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }

    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  private base64UrlDecode(str: string): Uint8Array {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) {
      base64 += '='
    }

    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    return bytes
  }
}
