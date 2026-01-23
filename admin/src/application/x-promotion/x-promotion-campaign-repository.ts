import type { XPromotionCampaign } from '../../domain/x-promotion/x-promotion-campaign.js'

export interface XPromotionCampaignReadRepository {
  findById(id: string): Promise<XPromotionCampaign | null>
  findByProductId(productId: string): Promise<XPromotionCampaign | null>
  findByProductAndSite(productId: string, siteId: string): Promise<XPromotionCampaign | null>
  findActiveByProductAndSite(productId: string, siteId: string): Promise<XPromotionCampaign | null>
  listBySiteId(siteId: string): Promise<XPromotionCampaign[]>
}

export interface XPromotionCampaignWriteRepository {
  create(campaign: XPromotionCampaign): Promise<void>
  update(campaign: XPromotionCampaign): Promise<void>
  upsert(campaign: XPromotionCampaign): Promise<void>
  updateStatus(id: string, status: string, updatedAt: string): Promise<void>
  delete(id: string): Promise<void>
}
