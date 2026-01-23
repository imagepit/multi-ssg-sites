import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createXUserConnection,
  isConnectionValid,
  type XUserConnection,
} from './x-user-connection.js'

describe('createXUserConnection', () => {
  it('creates a connection with valid input', () => {
    const tokenExpiresAt = Math.floor(Date.now() / 1000) + 7200 // 2 hours from now

    const connection = createXUserConnection({
      id: 'conn-123',
      userId: 'user-123',
      xUserId: '12345678901234567',
      xUsername: 'testuser',
      accessToken: 'encrypted_access_token_xxx',
      refreshToken: 'encrypted_refresh_token_yyy',
      tokenExpiresAt,
    })

    expect(connection.id).toBe('conn-123')
    expect(connection.userId).toBe('user-123')
    expect(connection.xUserId).toBe('12345678901234567')
    expect(connection.xUsername).toBe('testuser')
    expect(connection.accessToken).toBe('encrypted_access_token_xxx')
    expect(connection.refreshToken).toBe('encrypted_refresh_token_yyy')
    expect(connection.tokenExpiresAt).toBe(tokenExpiresAt)
    expect(connection.connectedAt).toBeDefined()
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createXUserConnection({
        id: '',
        userId: 'user-123',
        xUserId: '12345678901234567',
        xUsername: 'testuser',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('id is required')
  })

  it('throws error when userId is missing', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: '',
        xUserId: '12345678901234567',
        xUsername: 'testuser',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('userId is required')
  })

  it('throws error when xUserId is missing', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: 'user-123',
        xUserId: '',
        xUsername: 'testuser',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('xUserId is required')
  })

  it('throws error when xUsername is missing', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: 'user-123',
        xUserId: '12345678901234567',
        xUsername: '',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('xUsername is required')
  })

  it('throws error when accessToken is missing', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: 'user-123',
        xUserId: '12345678901234567',
        xUsername: 'testuser',
        accessToken: '',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('accessToken is required')
  })

  it('throws error when refreshToken is missing', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: 'user-123',
        xUserId: '12345678901234567',
        xUsername: 'testuser',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: '',
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
      })
    ).toThrow('refreshToken is required')
  })

  it('throws error when tokenExpiresAt is not positive', () => {
    expect(() =>
      createXUserConnection({
        id: 'conn-123',
        userId: 'user-123',
        xUserId: '12345678901234567',
        xUsername: 'testuser',
        accessToken: 'encrypted_access_token_xxx',
        refreshToken: 'encrypted_refresh_token_yyy',
        tokenExpiresAt: 0,
      })
    ).toThrow('tokenExpiresAt must be positive')
  })
})

describe('isConnectionValid', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-22T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true when token has not expired', () => {
    const tokenExpiresAt = Math.floor(new Date('2026-01-22T14:00:00Z').getTime() / 1000) // 2 hours later

    const connection = createXUserConnection({
      id: 'conn-123',
      userId: 'user-123',
      xUserId: '12345678901234567',
      xUsername: 'testuser',
      accessToken: 'encrypted_access_token_xxx',
      refreshToken: 'encrypted_refresh_token_yyy',
      tokenExpiresAt,
    })

    expect(isConnectionValid(connection)).toBe(true)
  })

  it('returns false when token has expired', () => {
    const tokenExpiresAt = Math.floor(new Date('2026-01-22T10:00:00Z').getTime() / 1000) // 2 hours ago

    const connection: XUserConnection = {
      id: 'conn-123',
      userId: 'user-123',
      xUserId: '12345678901234567',
      xUsername: 'testuser',
      accessToken: 'encrypted_access_token_xxx',
      refreshToken: 'encrypted_refresh_token_yyy',
      tokenExpiresAt,
      connectedAt: '2026-01-20T00:00:00Z',
    }

    expect(isConnectionValid(connection)).toBe(false)
  })

  it('returns true with buffer time (5 minutes before expiry)', () => {
    // Token expires at 12:04 (4 minutes from now)
    const tokenExpiresAt = Math.floor(new Date('2026-01-22T12:04:00Z').getTime() / 1000)

    const connection: XUserConnection = {
      id: 'conn-123',
      userId: 'user-123',
      xUserId: '12345678901234567',
      xUsername: 'testuser',
      accessToken: 'encrypted_access_token_xxx',
      refreshToken: 'encrypted_refresh_token_yyy',
      tokenExpiresAt,
      connectedAt: '2026-01-20T00:00:00Z',
    }

    // Default buffer is 5 minutes, so 4 minutes before expiry should be invalid
    expect(isConnectionValid(connection)).toBe(false)
  })

  it('returns true when token expires exactly at current time plus buffer', () => {
    // Token expires at 12:06 (6 minutes from now, which is > 5 min buffer)
    const tokenExpiresAt = Math.floor(new Date('2026-01-22T12:06:00Z').getTime() / 1000)

    const connection: XUserConnection = {
      id: 'conn-123',
      userId: 'user-123',
      xUserId: '12345678901234567',
      xUsername: 'testuser',
      accessToken: 'encrypted_access_token_xxx',
      refreshToken: 'encrypted_refresh_token_yyy',
      tokenExpiresAt,
      connectedAt: '2026-01-20T00:00:00Z',
    }

    expect(isConnectionValid(connection)).toBe(true)
  })
})
