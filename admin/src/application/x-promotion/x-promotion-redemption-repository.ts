import type { XPromotionRedemption } from '../../domain/x-promotion/x-promotion-redemption.js'

export interface XPromotionRedemptionReadRepository {
  findById(id: string): Promise<XPromotionRedemption | null>
  findByUserAndCampaign(userId: string, campaignId: string): Promise<XPromotionRedemption | null>
  listByUserId(userId: string): Promise<XPromotionRedemption[]>
  listByCampaignId(campaignId: string): Promise<XPromotionRedemption[]>
  existsByUserAndCampaign(userId: string, campaignId: string): Promise<boolean>
}

export interface XPromotionRedemptionWriteRepository {
  create(redemption: XPromotionRedemption): Promise<void>
  delete(id: string): Promise<void>
}
