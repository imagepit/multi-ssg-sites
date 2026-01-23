import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { JwtTokenIssuer } from '../../../infrastructure/auth/jwt-issuer.js'

/**
 * Authentication middleware for paid content API
 * Uses magic link JWT (different from admin JWT)
 */
export async function requirePaidContentAuth(
  request: Request,
  env: Env
): Promise<AuthClaims | Response> {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const secret = env.JWT_SECRET
  if (!secret) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const token = header.slice('Bearer '.length)

  try {
    const claims = await verifyAccessToken(token, secret)
    return claims
  } catch (error) {
    void error
    return new Response('Unauthorized', { status: 401 })
  }
}

/**
 * Optional authentication middleware for paid content API
 * Returns AuthClaims if valid token is provided, null otherwise
 * Use this for endpoints that work both authenticated and anonymously
 */
export async function optionalPaidContentAuth(
  request: Request,
  env: Env
): Promise<AuthClaims | null> {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return null
  }

  const secret = env.JWT_SECRET
  if (!secret) {
    return null
  }

  const token = header.slice('Bearer '.length)

  try {
    const claims = await verifyAccessToken(token, secret)
    return claims
  } catch (error) {
    void error
    return null
  }
}

async function verifyAccessToken(token: string, secret: string): Promise<AuthClaims> {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('invalid token format')
  }

  const [headerB64, payloadB64, signatureB64] = parts

  // Verify signature using HMAC-SHA256
  const data = `${headerB64}.${payloadB64}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const signature = base64UrlDecode(signatureB64)
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
  const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64))
  const claims = JSON.parse(payloadJson)

  // Check token type
  if (claims.type !== 'access') {
    throw new Error('not an access token')
  }

  // Check expiration
  const now = Math.floor(Date.now() / 1000)
  if (claims.exp && claims.exp < now) {
    throw new Error('token expired')
  }

  return {
    sub: claims.sub,
    email: claims.email,
    roles: claims.roles ?? [],
    siteIds: claims.siteIds ?? []
  }
}

function base64UrlDecode(str: string): Uint8Array {
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
