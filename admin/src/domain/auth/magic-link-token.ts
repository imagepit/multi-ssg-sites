export interface MagicLinkToken {
  id: string
  email: string
  tokenHash: string
  expiresAt: string
  usedAt: string | null
  createdAt: string
}

export interface CreateMagicLinkTokenInput {
  id: string
  email: string
  tokenHash: string
  expiresInMinutes?: number
}

const DEFAULT_EXPIRES_IN_MINUTES = 15

export function createMagicLinkToken(input: CreateMagicLinkTokenInput): MagicLinkToken {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.email) {
    throw new Error('email is required')
  }
  if (!input.tokenHash) {
    throw new Error('tokenHash is required')
  }

  const now = new Date()
  const expiresInMinutes = input.expiresInMinutes ?? DEFAULT_EXPIRES_IN_MINUTES
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000)

  return {
    id: input.id,
    email: input.email.toLowerCase().trim(),
    tokenHash: input.tokenHash,
    expiresAt: expiresAt.toISOString(),
    usedAt: null,
    createdAt: now.toISOString()
  }
}

export function isTokenExpired(token: MagicLinkToken): boolean {
  const now = new Date()
  const expiresAt = new Date(token.expiresAt)
  return now > expiresAt
}

export function isTokenUsed(token: MagicLinkToken): boolean {
  return token.usedAt !== null
}

export function isTokenValid(token: MagicLinkToken): boolean {
  return !isTokenExpired(token) && !isTokenUsed(token)
}
