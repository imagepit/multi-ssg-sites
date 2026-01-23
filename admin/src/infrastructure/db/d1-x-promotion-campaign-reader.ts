import type { XPromotionCampaign, XPromotionCampaignStatus } from '../../domain/x-promotion/x-promotion-campaign.js'
import type { XPromotionCampaignReadRepository } from '../../application/x-promotion/x-promotion-campaign-repository.js'

interface XPromotionCampaignRow {
  id: string
  product_id: string
  site_id: string
  slug: string
  tweet_id: string
  tweet_url: string | null
  label: string | null
  status: string
  starts_at: number | null
  ends_at: number | null
  created_at: string
  updated_at: string
}

export class D1XPromotionCampaignReader implements XPromotionCampaignReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<XPromotionCampaign | null> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at
         FROM x_promotion_campaigns
         WHERE id = ?`
      )
      .bind(id)
      .first<XPromotionCampaignRow>()

    if (!result) {
      return null
    }

    return this.mapRowToCampaign(result)
  }

  async findByProductId(productId: string): Promise<XPromotionCampaign | null> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at
         FROM x_promotion_campaigns
         WHERE product_id = ?`
      )
      .bind(productId)
      .first<XPromotionCampaignRow>()

    if (!result) {
      return null
    }

    return this.mapRowToCampaign(result)
  }

  async findByProductAndSite(productId: string, siteId: string): Promise<XPromotionCampaign | null> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at
         FROM x_promotion_campaigns
         WHERE product_id = ? AND site_id = ?`
      )
      .bind(productId, siteId)
      .first<XPromotionCampaignRow>()

    if (!result) {
      return null
    }

    return this.mapRowToCampaign(result)
  }

  async findActiveByProductAndSite(productId: string, siteId: string): Promise<XPromotionCampaign | null> {
    const nowSeconds = Math.floor(Date.now() / 1000)
    const result = await this.db
      .prepare(
        `SELECT id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at
         FROM x_promotion_campaigns
         WHERE product_id = ? AND site_id = ? AND status = 'active'
           AND (starts_at IS NULL OR starts_at <= ?)
           AND (ends_at IS NULL OR ends_at >= ?)`
      )
      .bind(productId, siteId, nowSeconds, nowSeconds)
      .first<XPromotionCampaignRow>()

    if (!result) {
      return null
    }

    return this.mapRowToCampaign(result)
  }

  async listBySiteId(siteId: string): Promise<XPromotionCampaign[]> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at
         FROM x_promotion_campaigns
         WHERE site_id = ?`
      )
      .bind(siteId)
      .all<XPromotionCampaignRow>()

    return (result.results ?? []).map((row) => this.mapRowToCampaign(row))
  }

  private mapRowToCampaign(row: XPromotionCampaignRow): XPromotionCampaign {
    return {
      id: row.id,
      productId: row.product_id,
      siteId: row.site_id,
      slug: row.slug,
      tweetId: row.tweet_id,
      tweetUrl: row.tweet_url ?? `https://x.com/i/status/${row.tweet_id}`,
      label: row.label ?? '拡散で応援して無料で読む',
      status: row.status as XPromotionCampaignStatus,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}
