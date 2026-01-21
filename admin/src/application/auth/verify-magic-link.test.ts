import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { verifyMagicLink } from './verify-magic-link.js'
import type { MagicLinkRepository } from './magic-link-repository.js'
import type { UserReadRepository, UserWriteRepository } from './user-repository.js'
import type { TokenIssuer } from './token-issuer.js'
import type { MagicLinkToken } from '../../domain/auth/magic-link-token.js'
import type { User } from '../../domain/auth/user.js'

describe('verifyMagicLink', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockDeps = () => {
    const validToken: MagicLinkToken = {
      id: 'token-id-123',
      email: 'test@example.com',
      tokenHash: 'hashed-token-xyz',
      expiresAt: '2026-01-21T00:15:00.000Z',
      usedAt: null,
      createdAt: '2026-01-21T00:00:00.000Z'
    }

    const existingUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    const magicLinkRepo: MagicLinkRepository = {
      create: vi.fn(),
      findByTokenHash: vi.fn().mockResolvedValue(validToken),
      markUsed: vi.fn().mockResolvedValue(undefined),
      deleteExpired: vi.fn()
    }

    const userReadRepo: UserReadRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(existingUser)
    }

    const userWriteRepo: UserWriteRepository = {
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn()
    }

    const tokenIssuer: TokenIssuer = {
      issueAccessToken: vi.fn(),
      issueRefreshToken: vi.fn(),
      issueTokenPair: vi.fn().mockResolvedValue({
        accessToken: 'access-token-abc',
        refreshToken: 'refresh-token-xyz'
      }),
      verifyRefreshToken: vi.fn()
    }

    return {
      magicLinkRepo,
      userReadRepo,
      userWriteRepo,
      tokenIssuer,
      hashToken: vi.fn().mockResolvedValue('hashed-token-xyz'),
      generateId: vi.fn().mockReturnValue('new-user-id'),
      validToken,
      existingUser
    }
  }

  it('verifies token and returns tokens for existing user', async () => {
    const deps = createMockDeps()

    const result = await verifyMagicLink({ token: 'raw-token-abc' }, deps)

    expect(result.accessToken).toBe('access-token-abc')
    expect(result.refreshToken).toBe('refresh-token-xyz')
    expect(result.user.id).toBe('user-123')
    expect(result.user.email).toBe('test@example.com')

    expect(deps.magicLinkRepo.markUsed).toHaveBeenCalledWith(
      'token-id-123',
      expect.any(String)
    )
  })

  it('creates new user if not exists', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.userReadRepo.findByEmail).mockResolvedValue(null)

    const result = await verifyMagicLink({ token: 'raw-token-abc' }, deps)

    expect(deps.userWriteRepo.create).toHaveBeenCalledTimes(1)
    expect(result.user.id).toBe('new-user-id')
    expect(result.user.email).toBe('test@example.com')
  })

  it('throws error when token is missing', async () => {
    const deps = createMockDeps()

    await expect(verifyMagicLink({ token: '' }, deps)).rejects.toThrow(
      'token is required'
    )
  })

  it('throws error when token is invalid', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.magicLinkRepo.findByTokenHash).mockResolvedValue(null)

    await expect(
      verifyMagicLink({ token: 'invalid-token' }, deps)
    ).rejects.toThrow('invalid token')
  })

  it('throws error when token is expired', async () => {
    const deps = createMockDeps()
    const expiredToken: MagicLinkToken = {
      ...deps.validToken,
      expiresAt: '2026-01-20T23:00:00.000Z' // expired
    }
    vi.mocked(deps.magicLinkRepo.findByTokenHash).mockResolvedValue(expiredToken)

    await expect(
      verifyMagicLink({ token: 'raw-token-abc' }, deps)
    ).rejects.toThrow('token expired or already used')
  })

  it('throws error when token is already used', async () => {
    const deps = createMockDeps()
    const usedToken: MagicLinkToken = {
      ...deps.validToken,
      usedAt: '2026-01-21T00:05:00.000Z'
    }
    vi.mocked(deps.magicLinkRepo.findByTokenHash).mockResolvedValue(usedToken)

    await expect(
      verifyMagicLink({ token: 'raw-token-abc' }, deps)
    ).rejects.toThrow('token expired or already used')
  })

  it('hashes the input token before lookup', async () => {
    const deps = createMockDeps()

    await verifyMagicLink({ token: 'raw-token-abc' }, deps)

    expect(deps.hashToken).toHaveBeenCalledWith('raw-token-abc')
    expect(deps.magicLinkRepo.findByTokenHash).toHaveBeenCalledWith(
      'hashed-token-xyz'
    )
  })
})
