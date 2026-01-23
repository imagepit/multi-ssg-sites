import type { XPromotionCampaign } from '../../domain/x-promotion/x-promotion-campaign.js'
import type { XPromotionCampaignWriteRepository } from '../../application/x-promotion/x-promotion-campaign-repository.js'

export class D1XPromotionCampaignWriter implements XPromotionCampaignWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(campaign: XPromotionCampaign): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO x_promotion_campaigns
         (id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        campaign.id,
        campaign.productId,
        campaign.siteId,
        campaign.slug,
        campaign.tweetId,
        campaign.tweetUrl,
        campaign.label,
        campaign.status,
        campaign.startsAt,
        campaign.endsAt,
        campaign.createdAt,
        campaign.updatedAt
      )
      .run()
  }

  async update(campaign: XPromotionCampaign): Promise<void> {
    await this.db
      .prepare(
        `UPDATE x_promotion_campaigns
         SET product_id = ?, site_id = ?, slug = ?, tweet_id = ?, tweet_url = ?, label = ?, status = ?, starts_at = ?, ends_at = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        campaign.productId,
        campaign.siteId,
        campaign.slug,
        campaign.tweetId,
        campaign.tweetUrl,
        campaign.label,
        campaign.status,
        campaign.startsAt,
        campaign.endsAt,
        campaign.updatedAt,
        campaign.id
      )
      .run()
  }

  async upsert(campaign: XPromotionCampaign): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO x_promotion_campaigns
         (id, product_id, site_id, slug, tweet_id, tweet_url, label, status, starts_at, ends_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(product_id, site_id, slug) DO UPDATE SET
           tweet_id = excluded.tweet_id,
           tweet_url = excluded.tweet_url,
           label = excluded.label,
           status = excluded.status,
           starts_at = excluded.starts_at,
           ends_at = excluded.ends_at,
           updated_at = excluded.updated_at`
      )
      .bind(
        campaign.id,
        campaign.productId,
        campaign.siteId,
        campaign.slug,
        campaign.tweetId,
        campaign.tweetUrl,
        campaign.label,
        campaign.status,
        campaign.startsAt,
        campaign.endsAt,
        campaign.createdAt,
        campaign.updatedAt
      )
      .run()
  }

  async updateStatus(id: string, status: string, updatedAt: string): Promise<void> {
    await this.db
      .prepare('UPDATE x_promotion_campaigns SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, updatedAt, id)
      .run()
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM x_promotion_campaigns WHERE id = ?')
      .bind(id)
      .run()
  }
}
