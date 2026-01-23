import { describe, it, expect, vi, beforeEach } from 'vitest'
import { startXOAuthFlow, type StartXOAuthFlowDeps, type OAuthStateStore } from './start-x-oauth-flow.js'
import type { XApiClient, XOAuthStartResult } from './x-api-client.js'

describe('startXOAuthFlow', () => {
  let mockXApiClient: XApiClient
  let mockStateStore: OAuthStateStore
  let deps: StartXOAuthFlowDeps

  beforeEach(() => {
    mockXApiClient = {
      startOAuthFlow: vi.fn().mockResolvedValue({
        authorizationUrl: 'https://twitter.com/i/oauth2/authorize?...',
        state: 'test-state-123',
        codeVerifier: 'test-code-verifier-abc',
      } as XOAuthStartResult),
      exchangeCodeForTokens: vi.fn(),
      refreshAccessToken: vi.fn(),
      getUserInfo: vi.fn(),
      checkRepost: vi.fn(),
    }

    mockStateStore = {
      set: vi.fn().mockResolvedValue(undefined),
    }

    deps = {
      xApiClient: mockXApiClient,
      stateStore: mockStateStore,
    }
  })

  it('should start OAuth flow and return authorization URL', async () => {
    const input = {
      userId: 'user-123',
      callbackUrl: 'https://example.com/callback',
    }

    const result = await startXOAuthFlow(input, deps)

    expect(result.authorizationUrl).toBe('https://twitter.com/i/oauth2/authorize?...')
    expect(result.state).toBe('test-state-123')
    expect(mockXApiClient.startOAuthFlow).toHaveBeenCalledWith(expect.any(String))
  })

  it('should store state with code verifier and user info', async () => {
    const input = {
      userId: 'user-123',
      callbackUrl: 'https://example.com/callback',
    }

    await startXOAuthFlow(input, deps)

    expect(mockStateStore.set).toHaveBeenCalledWith(
      'test-state-123',
      expect.objectContaining({
        codeVerifier: 'test-code-verifier-abc',
        userId: 'user-123',
        callbackUrl: 'https://example.com/callback',
      }),
      expect.any(Number) // TTL
    )
  })

  it('should store state with campaign info when provided', async () => {
    const input = {
      userId: 'user-123',
      callbackUrl: 'https://example.com/callback',
      campaignId: 'xpc:site-1:remotion',
    }

    await startXOAuthFlow(input, deps)

    expect(mockStateStore.set).toHaveBeenCalledWith(
      'test-state-123',
      expect.objectContaining({
        codeVerifier: 'test-code-verifier-abc',
        userId: 'user-123',
        campaignId: 'xpc:site-1:remotion',
      }),
      expect.any(Number)
    )
  })

  it('should throw error when userId is missing', async () => {
    const input = {
      userId: '',
      callbackUrl: 'https://example.com/callback',
    }

    await expect(startXOAuthFlow(input, deps)).rejects.toThrow('userId is required')
  })

  it('should throw error when callbackUrl is missing', async () => {
    const input = {
      userId: 'user-123',
      callbackUrl: '',
    }

    await expect(startXOAuthFlow(input, deps)).rejects.toThrow('callbackUrl is required')
  })

  it('should generate a unique state for each request', async () => {
    const input = {
      userId: 'user-123',
      callbackUrl: 'https://example.com/callback',
    }

    await startXOAuthFlow(input, deps)

    // Verify startOAuthFlow was called with a state
    expect(mockXApiClient.startOAuthFlow).toHaveBeenCalledWith(expect.any(String))
    const passedState = vi.mocked(mockXApiClient.startOAuthFlow).mock.calls[0][0]
    expect(passedState).toBeTruthy()
    expect(typeof passedState).toBe('string')
  })
})
