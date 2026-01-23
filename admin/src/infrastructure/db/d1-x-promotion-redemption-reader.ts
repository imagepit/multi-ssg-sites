import type { XPromotionRedemption } from '../../domain/x-promotion/x-promotion-redemption.js'
import type { XPromotionRedemptionReadRepository } from '../../application/x-promotion/x-promotion-redemption-repository.js'

interface XPromotionRedemptionRow {
  id: string
  campaign_id: string
  user_id: string
  x_user_id: string
  repost_id: string
  verified_at: string
  entitlement_id: string
}

export class D1XPromotionRedemptionReader implements XPromotionRedemptionReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<XPromotionRedemption | null> {
    const result = await this.db
      .prepare(
        `SELECT id, campaign_id, user_id, x_user_id, repost_id, verified_at, entitlement_id
         FROM x_promotion_redemptions
         WHERE id = ?`
      )
      .bind(id)
      .first<XPromotionRedemptionRow>()

    if (!result) {
      return null
    }

    return this.mapRowToRedemption(result)
  }

  async findByUserAndCampaign(userId: string, campaignId: string): Promise<XPromotionRedemption | null> {
    const result = await this.db
      .prepare(
        `SELECT id, campaign_id, user_id, x_user_id, repost_id, verified_at, entitlement_id
         FROM x_promotion_redemptions
         WHERE user_id = ? AND campaign_id = ?`
      )
      .bind(userId, campaignId)
      .first<XPromotionRedemptionRow>()

    if (!result) {
      return null
    }

    return this.mapRowToRedemption(result)
  }

  async listByUserId(userId: string): Promise<XPromotionRedemption[]> {
    const result = await this.db
      .prepare(
        `SELECT id, campaign_id, user_id, x_user_id, repost_id, verified_at, entitlement_id
         FROM x_promotion_redemptions
         WHERE user_id = ?`
      )
      .bind(userId)
      .all<XPromotionRedemptionRow>()

    return (result.results ?? []).map((row) => this.mapRowToRedemption(row))
  }

  async listByCampaignId(campaignId: string): Promise<XPromotionRedemption[]> {
    const result = await this.db
      .prepare(
        `SELECT id, campaign_id, user_id, x_user_id, repost_id, verified_at, entitlement_id
         FROM x_promotion_redemptions
         WHERE campaign_id = ?`
      )
      .bind(campaignId)
      .all<XPromotionRedemptionRow>()

    return (result.results ?? []).map((row) => this.mapRowToRedemption(row))
  }

  async existsByUserAndCampaign(userId: string, campaignId: string): Promise<boolean> {
    const result = await this.db
      .prepare(
        `SELECT 1 FROM x_promotion_redemptions WHERE user_id = ? AND campaign_id = ? LIMIT 1`
      )
      .bind(userId, campaignId)
      .first()

    return result !== null
  }

  private mapRowToRedemption(row: XPromotionRedemptionRow): XPromotionRedemption {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      userId: row.user_id,
      xUserId: row.x_user_id,
      repostId: row.repost_id,
      verifiedAt: row.verified_at,
      entitlementId: row.entitlement_id,
    }
  }
}
