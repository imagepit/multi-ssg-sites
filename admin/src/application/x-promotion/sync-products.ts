import type { XPromotionCampaignWriteRepository } from './x-promotion-campaign-repository.js'
import { createXPromotionCampaign } from '../../domain/x-promotion/x-promotion-campaign.js'

export interface XPromotionInput {
  tweet_id: string
  label?: string
  starts_at?: string
  ends_at?: string
}

export interface ProductSyncInput {
  id: string
  name: string
  x_promotion?: XPromotionInput
}

export interface SyncProductsInput {
  siteId: string
  products: ProductSyncInput[]
}

export interface SyncProductsDeps {
  campaignWriter: XPromotionCampaignWriteRepository
}

export interface SyncProductsResult {
  campaigns: {
    upserted: number
  }
}

/**
 * Extract slug from product id
 * e.g., "product:remotion-skills" -> "remotion-skills"
 */
function extractSlugFromProductId(productId: string): string {
  const parts = productId.split(':')
  return parts.length > 1 ? parts.slice(1).join(':') : productId
}

/**
 * Generate campaign id from product id and site id
 */
function generateCampaignId(productId: string, siteId: string): string {
  const slug = extractSlugFromProductId(productId)
  return `xpc:${siteId}:${slug}`
}

/**
 * Parse ISO 8601 date string to Unix timestamp (seconds)
 */
function parseIsoToTimestamp(isoString: string | undefined): number | null {
  if (!isoString) {
    return null
  }
  return Math.floor(new Date(isoString).getTime() / 1000)
}

export async function syncProducts(
  input: SyncProductsInput,
  deps: SyncProductsDeps
): Promise<SyncProductsResult> {
  if (!input.siteId) {
    throw new Error('siteId is required')
  }

  let upsertedCount = 0

  for (const product of input.products) {
    if (!product.x_promotion) {
      continue
    }

    if (!product.x_promotion.tweet_id) {
      throw new Error('tweet_id is required for x_promotion')
    }

    const slug = extractSlugFromProductId(product.id)
    const campaignId = generateCampaignId(product.id, input.siteId)

    const campaign = createXPromotionCampaign({
      id: campaignId,
      productId: product.id,
      siteId: input.siteId,
      slug,
      tweetId: product.x_promotion.tweet_id,
      label: product.x_promotion.label,
      startsAt: parseIsoToTimestamp(product.x_promotion.starts_at),
      endsAt: parseIsoToTimestamp(product.x_promotion.ends_at),
      status: 'active',
    })

    await deps.campaignWriter.upsert(campaign)
    upsertedCount++
  }

  return {
    campaigns: {
      upserted: upsertedCount,
    },
  }
}
