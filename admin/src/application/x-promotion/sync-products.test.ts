import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncProducts, type SyncProductsInput, type SyncProductsDeps } from './sync-products.js'
import type { XPromotionCampaignWriteRepository } from './x-promotion-campaign-repository.js'
import type { XPromotionCampaign } from '../../domain/x-promotion/x-promotion-campaign.js'

describe('syncProducts', () => {
  let mockCampaignWriter: XPromotionCampaignWriteRepository
  let deps: SyncProductsDeps

  beforeEach(() => {
    mockCampaignWriter = {
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    }
    deps = {
      campaignWriter: mockCampaignWriter,
    }
  })

  it('should sync x_promotion campaign for a product', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:remotion-skills',
          name: 'Remotion Agent Skills入門',
          x_promotion: {
            tweet_id: '1881632785927586250',
            label: '拡散で応援して無料で読む',
          },
        },
      ],
    }

    const result = await syncProducts(input, deps)

    expect(result.campaigns.upserted).toBe(1)
    expect(mockCampaignWriter.upsert).toHaveBeenCalledTimes(1)
    expect(mockCampaignWriter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 'product:remotion-skills',
        siteId: 'site-1',
        tweetId: '1881632785927586250',
        label: '拡散で応援して無料で読む',
        status: 'active',
      })
    )
  })

  it('should sync x_promotion campaign with ends_at', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:remotion-skills',
          name: 'Remotion Agent Skills入門',
          x_promotion: {
            tweet_id: '1881632785927586250',
            ends_at: '2026-01-25T23:59:59Z',
          },
        },
      ],
    }

    const result = await syncProducts(input, deps)

    expect(result.campaigns.upserted).toBe(1)
    expect(mockCampaignWriter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        endsAt: Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000),
      })
    )
  })

  it('should sync x_promotion campaign with starts_at', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:remotion-skills',
          name: 'Remotion Agent Skills入門',
          x_promotion: {
            tweet_id: '1881632785927586250',
            starts_at: '2026-01-20T00:00:00Z',
            ends_at: '2026-01-25T23:59:59Z',
          },
        },
      ],
    }

    const result = await syncProducts(input, deps)

    expect(result.campaigns.upserted).toBe(1)
    expect(mockCampaignWriter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        startsAt: Math.floor(new Date('2026-01-20T00:00:00Z').getTime() / 1000),
        endsAt: Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000),
      })
    )
  })

  it('should skip products without x_promotion', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:standard',
          name: 'Standard Product',
        },
      ],
    }

    const result = await syncProducts(input, deps)

    expect(result.campaigns.upserted).toBe(0)
    expect(mockCampaignWriter.upsert).not.toHaveBeenCalled()
  })

  it('should sync multiple products with x_promotion', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:1',
          name: 'Product 1',
          x_promotion: {
            tweet_id: '111111111111111111',
          },
        },
        {
          id: 'product:2',
          name: 'Product 2',
        },
        {
          id: 'product:3',
          name: 'Product 3',
          x_promotion: {
            tweet_id: '333333333333333333',
            label: 'カスタムラベル',
          },
        },
      ],
    }

    const result = await syncProducts(input, deps)

    expect(result.campaigns.upserted).toBe(2)
    expect(mockCampaignWriter.upsert).toHaveBeenCalledTimes(2)
  })

  it('should use default label when not specified', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:1',
          name: 'Product 1',
          x_promotion: {
            tweet_id: '111111111111111111',
          },
        },
      ],
    }

    await syncProducts(input, deps)

    expect(mockCampaignWriter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '拡散で応援して無料で読む',
      })
    )
  })

  it('should generate campaign id and slug from product id', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:remotion-skills',
          name: 'Remotion Agent Skills入門',
          x_promotion: {
            tweet_id: '1881632785927586250',
          },
        },
      ],
    }

    await syncProducts(input, deps)

    expect(mockCampaignWriter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringContaining('xpc:'),
        slug: 'remotion-skills',
      })
    )
  })

  it('should throw error when siteId is not provided', async () => {
    const input: SyncProductsInput = {
      siteId: '',
      products: [],
    }

    await expect(syncProducts(input, deps)).rejects.toThrow('siteId is required')
  })

  it('should throw error when x_promotion is missing tweet_id', async () => {
    const input: SyncProductsInput = {
      siteId: 'site-1',
      products: [
        {
          id: 'product:1',
          name: 'Product 1',
          x_promotion: {
            tweet_id: '',
          },
        },
      ],
    }

    await expect(syncProducts(input, deps)).rejects.toThrow('tweet_id is required')
  })
})
