import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createMagicLinkToken,
  isTokenExpired,
  isTokenUsed,
  isTokenValid
} from './magic-link-token.js'

describe('createMagicLinkToken', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a token with valid input', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    expect(token.id).toBe('token-123')
    expect(token.email).toBe('test@example.com')
    expect(token.tokenHash).toBe('hash-abc')
    expect(token.usedAt).toBeNull()
    expect(token.createdAt).toBe('2026-01-21T00:00:00.000Z')
  })

  it('sets default expiration to 15 minutes', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    expect(token.expiresAt).toBe('2026-01-21T00:15:00.000Z')
  })

  it('allows custom expiration time', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc',
      expiresInMinutes: 30
    })

    expect(token.expiresAt).toBe('2026-01-21T00:30:00.000Z')
  })

  it('normalizes email to lowercase', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'Test@EXAMPLE.com',
      tokenHash: 'hash-abc'
    })

    expect(token.email).toBe('test@example.com')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createMagicLinkToken({
        id: '',
        email: 'test@example.com',
        tokenHash: 'hash-abc'
      })
    ).toThrow('id is required')
  })

  it('throws error when email is missing', () => {
    expect(() =>
      createMagicLinkToken({
        id: 'token-123',
        email: '',
        tokenHash: 'hash-abc'
      })
    ).toThrow('email is required')
  })

  it('throws error when tokenHash is missing', () => {
    expect(() =>
      createMagicLinkToken({
        id: 'token-123',
        email: 'test@example.com',
        tokenHash: ''
      })
    ).toThrow('tokenHash is required')
  })
})

describe('isTokenExpired', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when token is not expired', () => {
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))

    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    vi.setSystemTime(new Date('2026-01-21T00:10:00Z'))
    expect(isTokenExpired(token)).toBe(false)
  })

  it('returns true when token is expired', () => {
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))

    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    vi.setSystemTime(new Date('2026-01-21T00:20:00Z'))
    expect(isTokenExpired(token)).toBe(true)
  })
})

describe('isTokenUsed', () => {
  it('returns false when token is not used', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    expect(isTokenUsed(token)).toBe(false)
  })

  it('returns true when token is used', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    const usedToken = { ...token, usedAt: '2026-01-21T00:05:00Z' }
    expect(isTokenUsed(usedToken)).toBe(true)
  })
})

describe('isTokenValid', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true when token is not expired and not used', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    vi.setSystemTime(new Date('2026-01-21T00:10:00Z'))
    expect(isTokenValid(token)).toBe(true)
  })

  it('returns false when token is expired', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    vi.setSystemTime(new Date('2026-01-21T00:20:00Z'))
    expect(isTokenValid(token)).toBe(false)
  })

  it('returns false when token is used', () => {
    const token = createMagicLinkToken({
      id: 'token-123',
      email: 'test@example.com',
      tokenHash: 'hash-abc'
    })

    const usedToken = { ...token, usedAt: '2026-01-21T00:05:00Z' }
    expect(isTokenValid(usedToken)).toBe(false)
  })
})
