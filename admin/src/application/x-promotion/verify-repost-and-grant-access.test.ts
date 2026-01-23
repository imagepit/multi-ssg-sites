import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  verifyRepostAndGrantAccess,
  type VerifyRepostAndGrantAccessDeps,
} from './verify-repost-and-grant-access.js'
import type { XApiClient, XRepostCheckResult } from './x-api-client.js'
import type { XUserConnectionReadRepository } from './x-user-connection-repository.js'
import type { XPromotionCampaignReadRepository } from './x-promotion-campaign-repository.js'
import type { XPromotionRedemptionReadRepository, XPromotionRedemptionWriteRepository } from './x-promotion-redemption-repository.js'
import type { EntitlementWriteRepository } from '../entitlement/entitlement-repository.js'
import type { XUserConnection } from '../../domain/x-promotion/x-user-connection.js'
import type { XPromotionCampaign } from '../../domain/x-promotion/x-promotion-campaign.js'

describe('verifyRepostAndGrantAccess', () => {
  let mockXApiClient: XApiClient
  let mockConnectionReader: XUserConnectionReadRepository
  let mockCampaignReader: XPromotionCampaignReadRepository
  let mockRedemptionReader: XPromotionRedemptionReadRepository
  let mockRedemptionWriter: XPromotionRedemptionWriteRepository
  let mockEntitlementWriter: EntitlementWriteRepository
  let deps: VerifyRepostAndGrantAccessDeps

  const mockConnection: XUserConnection = {
    id: 'conn-123',
    userId: 'user-123',
    xUserId: 'x-user-999',
    xUsername: 'testuser',
    accessToken: 'access-token-xyz',
    refreshToken: 'refresh-token-xyz',
    tokenExpiresAt: Math.floor(Date.now() / 1000) + 7200,
    connectedAt: '2025-01-01T00:00:00Z',
  }

  const mockCampaign: XPromotionCampaign = {
    id: 'xpc:site-1:remotion',
    productId: 'product:remotion',
    siteId: 'site-1',
    slug: 'remotion',
    tweetId: '1881632785927586250',
    tweetUrl: 'https://x.com/i/status/1881632785927586250',
    label: '拡散で応援して無料で読む',
    status: 'active',
    startsAt: null,
    endsAt: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  beforeEach(() => {
    mockXApiClient = {
      startOAuthFlow: vi.fn(),
      exchangeCodeForTokens: vi.fn(),
      refreshAccessToken: vi.fn(),
      getUserInfo: vi.fn(),
      checkRepost: vi.fn().mockResolvedValue({
        hasReposted: true,
        repostId: 'repost:x-user-999:1881632785927586250',
      } as XRepostCheckResult),
    }

    mockConnectionReader = {
      findById: vi.fn(),
      findByUserId: vi.fn().mockResolvedValue(mockConnection),
      findByXUserId: vi.fn(),
    }

    mockCampaignReader = {
      findById: vi.fn().mockResolvedValue(mockCampaign),
      findByProductId: vi.fn(),
      findByProductAndSite: vi.fn(),
      findActiveByProductAndSite: vi.fn(),
      listBySiteId: vi.fn(),
    }

    mockRedemptionReader = {
      findById: vi.fn(),
      findByUserAndCampaign: vi.fn().mockResolvedValue(null),
      listByUserId: vi.fn(),
      listByCampaignId: vi.fn(),
      existsByUserAndCampaign: vi.fn().mockResolvedValue(false),
    }

    mockRedemptionWriter = {
      create: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
    }

    mockEntitlementWriter = {
      create: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn(),
      revoke: vi.fn(),
    }

    deps = {
      xApiClient: mockXApiClient,
      connectionReader: mockConnectionReader,
      campaignReader: mockCampaignReader,
      redemptionReader: mockRedemptionReader,
      redemptionWriter: mockRedemptionWriter,
      entitlementWriter: mockEntitlementWriter,
      generateId: () => 'generated-id-123',
    }
  })

  it('should verify repost and grant access', async () => {
    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(result.success).toBe(true)
    expect(result.entitlementId).toBe('generated-id-123')
    expect(mockXApiClient.checkRepost).toHaveBeenCalledWith(
      'access-token-xyz',
      'x-user-999',
      '1881632785927586250'
    )
    expect(mockRedemptionWriter.create).toHaveBeenCalled()
    expect(mockEntitlementWriter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        productId: 'product:remotion',
        siteId: 'site-1',
        grantedBy: 'promotion',
      })
    )
  })

  it('should return success false when user has not reposted', async () => {
    vi.mocked(mockXApiClient.checkRepost).mockResolvedValue({
      hasReposted: false,
    })

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(result.success).toBe(false)
    expect(result.reason).toBe('repost_not_found')
    expect(mockRedemptionWriter.create).not.toHaveBeenCalled()
    expect(mockEntitlementWriter.create).not.toHaveBeenCalled()
  })

  it('should return already redeemed when user has already claimed', async () => {
    vi.mocked(mockRedemptionReader.existsByUserAndCampaign).mockResolvedValue(true)

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(result.success).toBe(false)
    expect(result.reason).toBe('already_redeemed')
    expect(mockXApiClient.checkRepost).not.toHaveBeenCalled()
  })

  it('should throw error when user has no X connection', async () => {
    vi.mocked(mockConnectionReader.findByUserId).mockResolvedValue(null)

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    await expect(verifyRepostAndGrantAccess(input, deps)).rejects.toThrow(
      'X connection not found'
    )
  })

  it('should throw error when campaign not found', async () => {
    vi.mocked(mockCampaignReader.findById).mockResolvedValue(null)

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:nonexistent',
    }

    await expect(verifyRepostAndGrantAccess(input, deps)).rejects.toThrow(
      'Campaign not found'
    )
  })

  it('should return campaign_ended when campaign is not active', async () => {
    vi.mocked(mockCampaignReader.findById).mockResolvedValue({
      ...mockCampaign,
      status: 'ended',
    })

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(result.success).toBe(false)
    expect(result.reason).toBe('campaign_ended')
  })

  it('should return campaign_ended when campaign period has ended', async () => {
    const pastTimestamp = Math.floor(Date.now() / 1000) - 86400 // 1 day ago
    vi.mocked(mockCampaignReader.findById).mockResolvedValue({
      ...mockCampaign,
      endsAt: pastTimestamp,
    })

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(result.success).toBe(false)
    expect(result.reason).toBe('campaign_ended')
  })

  it('should throw error when userId is missing', async () => {
    const input = {
      userId: '',
      campaignId: 'xpc:site-1:remotion',
    }

    await expect(verifyRepostAndGrantAccess(input, deps)).rejects.toThrow(
      'userId is required'
    )
  })

  it('should throw error when campaignId is missing', async () => {
    const input = {
      userId: 'user-123',
      campaignId: '',
    }

    await expect(verifyRepostAndGrantAccess(input, deps)).rejects.toThrow(
      'campaignId is required'
    )
  })

  it('should handle token refresh when access token is expired', async () => {
    const expiredConnection: XUserConnection = {
      ...mockConnection,
      tokenExpiresAt: Math.floor(Date.now() / 1000) - 100, // expired
    }
    vi.mocked(mockConnectionReader.findByUserId).mockResolvedValue(expiredConnection)

    vi.mocked(mockXApiClient.refreshAccessToken).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 7200,
      scope: 'tweet.read users.read like.read offline.access',
    })

    const input = {
      userId: 'user-123',
      campaignId: 'xpc:site-1:remotion',
    }

    const result = await verifyRepostAndGrantAccess(input, deps)

    expect(mockXApiClient.refreshAccessToken).toHaveBeenCalledWith('refresh-token-xyz')
    expect(mockXApiClient.checkRepost).toHaveBeenCalledWith(
      'new-access-token',
      'x-user-999',
      '1881632785927586250'
    )
    expect(result.success).toBe(true)
  })
})
