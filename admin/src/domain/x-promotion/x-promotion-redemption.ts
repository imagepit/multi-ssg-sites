export interface XPromotionRedemption {
  id: string
  campaignId: string
  userId: string
  xUserId: string
  repostId: string
  verifiedAt: string
  entitlementId: string
}

export interface CreateXPromotionRedemptionInput {
  id: string
  campaignId: string
  userId: string
  xUserId: string
  repostId: string
  entitlementId: string
}

export function createXPromotionRedemption(input: CreateXPromotionRedemptionInput): XPromotionRedemption {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.campaignId) {
    throw new Error('campaignId is required')
  }
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.xUserId) {
    throw new Error('xUserId is required')
  }
  if (!input.repostId) {
    throw new Error('repostId is required')
  }
  if (!input.entitlementId) {
    throw new Error('entitlementId is required')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    campaignId: input.campaignId,
    userId: input.userId,
    xUserId: input.xUserId,
    repostId: input.repostId,
    entitlementId: input.entitlementId,
    verifiedAt: now,
  }
}
