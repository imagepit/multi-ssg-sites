import { describe, it, expect, vi, beforeEach } from 'vitest'
import { completeXOAuth, type CompleteXOAuthDeps, type OAuthStateStore } from './complete-x-oauth.js'
import type { XApiClient, XOAuthTokenResult, XUserInfo } from './x-api-client.js'
import type { XUserConnectionWriteRepository, XUserConnectionReadRepository } from './x-user-connection-repository.js'
import type { OAuthStateData } from './start-x-oauth-flow.js'

describe('completeXOAuth', () => {
  let mockXApiClient: XApiClient
  let mockStateStore: OAuthStateStore
  let mockConnectionReader: XUserConnectionReadRepository
  let mockConnectionWriter: XUserConnectionWriteRepository
  let deps: CompleteXOAuthDeps

  const mockStateData: OAuthStateData = {
    codeVerifier: 'test-code-verifier-abc',
    userId: 'user-123',
    callbackUrl: 'https://example.com/callback',
    campaignId: 'xpc:site-1:remotion',
    createdAt: Date.now(),
  }

  const mockTokenResult: XOAuthTokenResult = {
    accessToken: 'access-token-xyz',
    refreshToken: 'refresh-token-xyz',
    expiresIn: 7200,
    scope: 'tweet.read users.read like.read offline.access',
  }

  const mockUserInfo: XUserInfo = {
    id: 'x-user-999',
    username: 'testuser',
    name: 'Test User',
  }

  beforeEach(() => {
    mockXApiClient = {
      startOAuthFlow: vi.fn(),
      exchangeCodeForTokens: vi.fn().mockResolvedValue(mockTokenResult),
      refreshAccessToken: vi.fn(),
      getUserInfo: vi.fn().mockResolvedValue(mockUserInfo),
      checkRepost: vi.fn(),
    }

    mockStateStore = {
      get: vi.fn().mockResolvedValue(mockStateData),
      delete: vi.fn().mockResolvedValue(undefined),
    }

    mockConnectionReader = {
      findById: vi.fn(),
      findByUserId: vi.fn().mockResolvedValue(null),
      findByXUserId: vi.fn().mockResolvedValue(null),
    }

    mockConnectionWriter = {
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      updateTokens: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      deleteByUserId: vi.fn(),
    }

    deps = {
      xApiClient: mockXApiClient,
      stateStore: mockStateStore,
      connectionReader: mockConnectionReader,
      connectionWriter: mockConnectionWriter,
      generateId: () => 'generated-id-123',
    }
  })

  it('should exchange code for tokens and create new connection', async () => {
    const input = {
      code: 'auth-code-123',
      state: 'test-state-123',
    }

    const result = await completeXOAuth(input, deps)

    expect(mockXApiClient.exchangeCodeForTokens).toHaveBeenCalledWith(
      'auth-code-123',
      'test-code-verifier-abc'
    )
    expect(mockXApiClient.getUserInfo).toHaveBeenCalledWith('access-token-xyz')
    expect(mockConnectionWriter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        xUserId: 'x-user-999',
        xUsername: 'testuser',
        accessToken: 'access-token-xyz',
        refreshToken: 'refresh-token-xyz',
      })
    )
    expect(result.userId).toBe('user-123')
    expect(result.xUserId).toBe('x-user-999')
    expect(result.xUsername).toBe('testuser')
    expect(result.campaignId).toBe('xpc:site-1:remotion')
  })

  it('should update existing connection for same user', async () => {
    vi.mocked(mockConnectionReader.findByUserId).mockResolvedValue({
      id: 'existing-connection-id',
      userId: 'user-123',
      xUserId: 'x-user-old',
      xUsername: 'olduser',
      accessToken: 'old-access-token',
      refreshToken: 'old-refresh-token',
      tokenExpiresAt: 1000,
      connectedAt: '2025-01-01T00:00:00Z',
    })

    const input = {
      code: 'auth-code-123',
      state: 'test-state-123',
    }

    await completeXOAuth(input, deps)

    expect(mockConnectionWriter.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'existing-connection-id',
        userId: 'user-123',
        xUserId: 'x-user-999',
        xUsername: 'testuser',
      })
    )
    expect(mockConnectionWriter.create).not.toHaveBeenCalled()
  })

  it('should delete state after successful completion', async () => {
    const input = {
      code: 'auth-code-123',
      state: 'test-state-123',
    }

    await completeXOAuth(input, deps)

    expect(mockStateStore.delete).toHaveBeenCalledWith('test-state-123')
  })

  it('should throw error when state is not found', async () => {
    vi.mocked(mockStateStore.get).mockResolvedValue(null)

    const input = {
      code: 'auth-code-123',
      state: 'invalid-state',
    }

    await expect(completeXOAuth(input, deps)).rejects.toThrow('Invalid or expired state')
  })

  it('should throw error when code is missing', async () => {
    const input = {
      code: '',
      state: 'test-state-123',
    }

    await expect(completeXOAuth(input, deps)).rejects.toThrow('code is required')
  })

  it('should throw error when state is missing', async () => {
    const input = {
      code: 'auth-code-123',
      state: '',
    }

    await expect(completeXOAuth(input, deps)).rejects.toThrow('state is required')
  })

  it('should return result without campaignId when not in state', async () => {
    const stateWithoutCampaign: OAuthStateData = {
      ...mockStateData,
      campaignId: undefined,
    }
    vi.mocked(mockStateStore.get).mockResolvedValue(stateWithoutCampaign)

    const input = {
      code: 'auth-code-123',
      state: 'test-state-123',
    }

    const result = await completeXOAuth(input, deps)

    expect(result.campaignId).toBeUndefined()
  })

  it('should calculate token expiration correctly', async () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    const input = {
      code: 'auth-code-123',
      state: 'test-state-123',
    }

    await completeXOAuth(input, deps)

    const expectedExpiresAt = Math.floor(now / 1000) + 7200
    expect(mockConnectionWriter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenExpiresAt: expectedExpiresAt,
      })
    )

    vi.restoreAllMocks()
  })
})
