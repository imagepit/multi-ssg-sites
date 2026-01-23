import type { TokenVerifier } from '../../application/auth/token-verifier.js'
import type { AuthClaims } from '../../domain/auth/claims.js'

interface JwtHeader {
  alg: string
  typ?: string
}

interface JwtPayload extends AuthClaims {
  exp?: number
  nbf?: number
  iat?: number
  [key: string]: unknown
}

const encoder = new TextEncoder()

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

function decodeBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function decodeJson<T>(input: string): T {
  const bytes = decodeBase64Url(input)
  const text = new TextDecoder().decode(bytes)
  return JSON.parse(text) as T
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'verify',
    'sign'
  ])
}

function assertJwtClaims(payload: JwtPayload): void {
  if (!payload.sub) {
    throw new Error('JWT missing subject')
  }
  const now = Math.floor(Date.now() / 1000)
  if (payload.nbf !== undefined && now < payload.nbf) {
    throw new Error('JWT not yet valid')
  }
  if (payload.exp !== undefined && now >= payload.exp) {
    throw new Error('JWT expired')
  }
}

async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const header = decodeJson<JwtHeader>(encodedHeader)
  if (header.alg !== 'HS256') {
    throw new Error('Unsupported JWT algorithm')
  }

  const key = await getHmacKey(secret)
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`)
  const signature = decodeBase64Url(encodedSignature)
  const valid = await crypto.subtle.verify('HMAC', key, toArrayBuffer(signature), data)

  if (!valid) {
    throw new Error('Invalid JWT signature')
  }

  const payload = decodeJson<JwtPayload>(encodedPayload)
  assertJwtClaims(payload)
  return payload
}

export class JwtTokenVerifier implements TokenVerifier {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  async verify(token: string): Promise<AuthClaims> {
    if (!this.secret) {
      throw new Error('JWT secret not configured')
    }
    const payload = await verifyJwt(token, this.secret)
    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
      siteIds: payload.siteIds
    }
  }
}
