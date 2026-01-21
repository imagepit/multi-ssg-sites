import { describe, it, expect, vi } from 'vitest'
import { refreshToken } from './refresh-token.js'
import type { UserReadRepository } from './user-repository.js'
import type { TokenIssuer } from './token-issuer.js'
import type { User } from '../../domain/auth/user.js'

describe('refreshToken', () => {
  const createMockDeps = () => {
    const activeUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    const userReadRepo: UserReadRepository = {
      findById: vi.fn().mockResolvedValue(activeUser),
      findByEmail: vi.fn()
    }

    const tokenIssuer: TokenIssuer = {
      issueAccessToken: vi.fn().mockResolvedValue('new-access-token'),
      issueRefreshToken: vi.fn(),
      issueTokenPair: vi.fn(),
      verifyRefreshToken: vi.fn().mockResolvedValue({
        sub: 'user-123',
        email: 'test@example.com',
        roles: ['viewer'],
        siteIds: ['site-1']
      })
    }

    return { userReadRepo, tokenIssuer, activeUser }
  }

  it('issues new access token for valid refresh token', async () => {
    const deps = createMockDeps()

    const result = await refreshToken(
      { refreshToken: 'valid-refresh-token' },
      deps
    )

    expect(result.accessToken).toBe('new-access-token')
    expect(deps.tokenIssuer.verifyRefreshToken).toHaveBeenCalledWith(
      'valid-refresh-token'
    )
    expect(deps.tokenIssuer.issueAccessToken).toHaveBeenCalledWith({
      sub: 'user-123',
      email: 'test@example.com',
      roles: ['viewer'],
      siteIds: ['site-1']
    })
  })

  it('throws error when refreshToken is missing', async () => {
    const deps = createMockDeps()

    await expect(refreshToken({ refreshToken: '' }, deps)).rejects.toThrow(
      'refreshToken is required'
    )
  })

  it('throws error when user is not found', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.userReadRepo.findById).mockResolvedValue(null)

    await expect(
      refreshToken({ refreshToken: 'valid-refresh-token' }, deps)
    ).rejects.toThrow('user not found')
  })

  it('throws error when user is suspended', async () => {
    const deps = createMockDeps()
    const suspendedUser: User = {
      ...deps.activeUser,
      status: 'suspended'
    }
    vi.mocked(deps.userReadRepo.findById).mockResolvedValue(suspendedUser)

    await expect(
      refreshToken({ refreshToken: 'valid-refresh-token' }, deps)
    ).rejects.toThrow('user is not active')
  })

  it('throws error when refresh token is invalid', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.tokenIssuer.verifyRefreshToken).mockRejectedValue(
      new Error('invalid token')
    )

    await expect(
      refreshToken({ refreshToken: 'invalid-refresh-token' }, deps)
    ).rejects.toThrow('invalid token')
  })
})
