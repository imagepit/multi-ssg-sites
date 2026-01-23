import type { XPromotionRedemption } from '../../domain/x-promotion/x-promotion-redemption.js'
import type { XPromotionRedemptionWriteRepository } from '../../application/x-promotion/x-promotion-redemption-repository.js'

export class D1XPromotionRedemptionWriter implements XPromotionRedemptionWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(redemption: XPromotionRedemption): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO x_promotion_redemptions
         (id, campaign_id, user_id, x_user_id, repost_id, verified_at, entitlement_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        redemption.id,
        redemption.campaignId,
        redemption.userId,
        redemption.xUserId,
        redemption.repostId,
        redemption.verifiedAt,
        redemption.entitlementId
      )
      .run()
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM x_promotion_redemptions WHERE id = ?')
      .bind(id)
      .run()
  }
}
