import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createXPromotionCampaign,
  isCampaignActive,
  type XPromotionCampaign,
  type XPromotionCampaignStatus,
} from './x-promotion-campaign.js'

describe('createXPromotionCampaign', () => {
  it('creates a campaign with valid input', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
    })

    expect(campaign.id).toBe('campaign-123')
    expect(campaign.productId).toBe('product:remotion-skills')
    expect(campaign.siteId).toBe('dx-media')
    expect(campaign.slug).toBe('remotion-agent-skills')
    expect(campaign.tweetId).toBe('1881632785927586250')
    expect(campaign.tweetUrl).toBe('https://x.com/i/status/1881632785927586250')
    expect(campaign.label).toBe('拡散で応援して無料で読む')
    expect(campaign.status).toBe('active')
    expect(campaign.startsAt).toBeNull()
    expect(campaign.endsAt).toBeNull()
    expect(campaign.createdAt).toBeDefined()
    expect(campaign.updatedAt).toBeDefined()
  })

  it('creates a campaign with custom label', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      label: 'シェアして無料で読む',
    })

    expect(campaign.label).toBe('シェアして無料で読む')
  })

  it('creates a campaign with custom tweetUrl', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      tweetUrl: 'https://twitter.com/user/status/1881632785927586250',
    })

    expect(campaign.tweetUrl).toBe('https://twitter.com/user/status/1881632785927586250')
  })

  it('creates a campaign with time-limited promotion', () => {
    const startsAt = Math.floor(new Date('2026-01-21T00:00:00Z').getTime() / 1000)
    const endsAt = Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      startsAt,
      endsAt,
    })

    expect(campaign.startsAt).toBe(startsAt)
    expect(campaign.endsAt).toBe(endsAt)
  })

  it('creates a campaign with initial status', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      status: 'paused',
    })

    expect(campaign.status).toBe('paused')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createXPromotionCampaign({
        id: '',
        productId: 'product:remotion-skills',
        siteId: 'dx-media',
        slug: 'remotion-agent-skills',
        tweetId: '1881632785927586250',
      })
    ).toThrow('id is required')
  })

  it('throws error when productId is missing', () => {
    expect(() =>
      createXPromotionCampaign({
        id: 'campaign-123',
        productId: '',
        siteId: 'dx-media',
        slug: 'remotion-agent-skills',
        tweetId: '1881632785927586250',
      })
    ).toThrow('productId is required')
  })

  it('throws error when siteId is missing', () => {
    expect(() =>
      createXPromotionCampaign({
        id: 'campaign-123',
        productId: 'product:remotion-skills',
        siteId: '',
        slug: 'remotion-agent-skills',
        tweetId: '1881632785927586250',
      })
    ).toThrow('siteId is required')
  })

  it('throws error when slug is missing', () => {
    expect(() =>
      createXPromotionCampaign({
        id: 'campaign-123',
        productId: 'product:remotion-skills',
        siteId: 'dx-media',
        slug: '',
        tweetId: '1881632785927586250',
      })
    ).toThrow('slug is required')
  })

  it('throws error when tweetId is missing', () => {
    expect(() =>
      createXPromotionCampaign({
        id: 'campaign-123',
        productId: 'product:remotion-skills',
        siteId: 'dx-media',
        slug: 'remotion-agent-skills',
        tweetId: '',
      })
    ).toThrow('tweetId is required')
  })
})

describe('isCampaignActive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-22T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for active campaign without time limits', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
    })

    expect(isCampaignActive(campaign)).toBe(true)
  })

  it('returns false for paused campaign', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      status: 'paused',
    })

    expect(isCampaignActive(campaign)).toBe(false)
  })

  it('returns false for ended campaign', () => {
    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      status: 'ended',
    })

    expect(isCampaignActive(campaign)).toBe(false)
  })

  it('returns true when current time is within campaign period', () => {
    const startsAt = Math.floor(new Date('2026-01-21T00:00:00Z').getTime() / 1000)
    const endsAt = Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      startsAt,
      endsAt,
    })

    expect(isCampaignActive(campaign)).toBe(true)
  })

  it('returns false when campaign has not started yet', () => {
    const startsAt = Math.floor(new Date('2026-01-23T00:00:00Z').getTime() / 1000)
    const endsAt = Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      startsAt,
      endsAt,
    })

    expect(isCampaignActive(campaign)).toBe(false)
  })

  it('returns false when campaign has ended', () => {
    const startsAt = Math.floor(new Date('2026-01-19T00:00:00Z').getTime() / 1000)
    const endsAt = Math.floor(new Date('2026-01-21T23:59:59Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      startsAt,
      endsAt,
    })

    expect(isCampaignActive(campaign)).toBe(false)
  })

  it('returns true when only startsAt is set and current time is after', () => {
    const startsAt = Math.floor(new Date('2026-01-21T00:00:00Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      startsAt,
    })

    expect(isCampaignActive(campaign)).toBe(true)
  })

  it('returns true when only endsAt is set and current time is before', () => {
    const endsAt = Math.floor(new Date('2026-01-25T23:59:59Z').getTime() / 1000)

    const campaign = createXPromotionCampaign({
      id: 'campaign-123',
      productId: 'product:remotion-skills',
      siteId: 'dx-media',
      slug: 'remotion-agent-skills',
      tweetId: '1881632785927586250',
      endsAt,
    })

    expect(isCampaignActive(campaign)).toBe(true)
  })
})
