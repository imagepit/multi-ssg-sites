export type XPromotionCampaignStatus = 'active' | 'paused' | 'ended'

export interface XPromotionCampaign {
  id: string
  productId: string
  siteId: string
  slug: string
  tweetId: string
  tweetUrl: string
  label: string
  status: XPromotionCampaignStatus
  startsAt: number | null
  endsAt: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateXPromotionCampaignInput {
  id: string
  productId: string
  siteId: string
  slug: string
  tweetId: string
  tweetUrl?: string
  label?: string
  status?: XPromotionCampaignStatus
  startsAt?: number | null
  endsAt?: number | null
}

const DEFAULT_LABEL = '拡散で応援して無料で読む'

/**
 * Generate X post URL from tweet ID
 */
function generateTweetUrl(tweetId: string): string {
  return `https://x.com/i/status/${tweetId}`
}

export function createXPromotionCampaign(input: CreateXPromotionCampaignInput): XPromotionCampaign {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (!input.slug) {
    throw new Error('slug is required')
  }
  if (!input.tweetId) {
    throw new Error('tweetId is required')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    productId: input.productId,
    siteId: input.siteId,
    slug: input.slug,
    tweetId: input.tweetId,
    tweetUrl: input.tweetUrl ?? generateTweetUrl(input.tweetId),
    label: input.label ?? DEFAULT_LABEL,
    status: input.status ?? 'active',
    startsAt: input.startsAt ?? null,
    endsAt: input.endsAt ?? null,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Check if a campaign is currently active
 * Returns true if:
 * - status is 'active'
 * - current time is within startsAt and endsAt (if set)
 */
export function isCampaignActive(campaign: XPromotionCampaign): boolean {
  if (campaign.status !== 'active') {
    return false
  }

  const nowSeconds = Math.floor(Date.now() / 1000)

  // Check if campaign has started
  if (campaign.startsAt !== null && nowSeconds < campaign.startsAt) {
    return false
  }

  // Check if campaign has ended
  if (campaign.endsAt !== null && nowSeconds > campaign.endsAt) {
    return false
  }

  return true
}
