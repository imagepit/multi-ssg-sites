import type { XApiClient } from './x-api-client.js'
import type { XUserConnectionReadRepository } from './x-user-connection-repository.js'
import type { XPromotionCampaignReadRepository } from './x-promotion-campaign-repository.js'
import type { XPromotionRedemptionReadRepository, XPromotionRedemptionWriteRepository } from './x-promotion-redemption-repository.js'
import type { EntitlementWriteRepository } from '../entitlement/entitlement-repository.js'
import { isCampaignActive } from '../../domain/x-promotion/x-promotion-campaign.js'
import { isConnectionValid } from '../../domain/x-promotion/x-user-connection.js'
import { createXPromotionRedemption } from '../../domain/x-promotion/x-promotion-redemption.js'
import { createEntitlement } from '../../domain/entitlement/entitlement.js'

export interface VerifyRepostAndGrantAccessInput {
  userId: string
  campaignId: string
}

export interface VerifyRepostAndGrantAccessDeps {
  xApiClient: XApiClient
  connectionReader: XUserConnectionReadRepository
  campaignReader: XPromotionCampaignReadRepository
  redemptionReader: XPromotionRedemptionReadRepository
  redemptionWriter: XPromotionRedemptionWriteRepository
  entitlementWriter: EntitlementWriteRepository
  generateId: () => string
}

export type VerifyRepostFailReason =
  | 'repost_not_found'
  | 'already_redeemed'
  | 'campaign_ended'

export interface VerifyRepostAndGrantAccessResult {
  success: boolean
  entitlementId?: string
  reason?: VerifyRepostFailReason
}

export async function verifyRepostAndGrantAccess(
  input: VerifyRepostAndGrantAccessInput,
  deps: VerifyRepostAndGrantAccessDeps
): Promise<VerifyRepostAndGrantAccessResult> {
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.campaignId) {
    throw new Error('campaignId is required')
  }

  // Get user's X connection
  const connection = await deps.connectionReader.findByUserId(input.userId)
  if (!connection) {
    throw new Error('X connection not found')
  }

  // Get campaign
  const campaign = await deps.campaignReader.findById(input.campaignId)
  if (!campaign) {
    throw new Error('Campaign not found')
  }

  // Check if campaign is active
  if (!isCampaignActive(campaign)) {
    return {
      success: false,
      reason: 'campaign_ended',
    }
  }

  // Check if already redeemed
  const alreadyRedeemed = await deps.redemptionReader.existsByUserAndCampaign(
    input.userId,
    input.campaignId
  )
  if (alreadyRedeemed) {
    return {
      success: false,
      reason: 'already_redeemed',
    }
  }

  // Get valid access token (refresh if needed)
  let accessToken = connection.accessToken
  if (!isConnectionValid(connection)) {
    const refreshResult = await deps.xApiClient.refreshAccessToken(connection.refreshToken)
    accessToken = refreshResult.accessToken
    // Note: In production, we should also update the stored tokens
  }

  // Verify repost via X API
  const repostResult = await deps.xApiClient.checkRepost(
    accessToken,
    connection.xUserId,
    campaign.tweetId
  )

  if (!repostResult.hasReposted) {
    return {
      success: false,
      reason: 'repost_not_found',
    }
  }

  // Generate IDs for new records
  const entitlementId = deps.generateId()
  const redemptionId = deps.generateId()

  // Create entitlement
  const entitlement = createEntitlement({
    id: entitlementId,
    userId: input.userId,
    productId: campaign.productId,
    siteId: campaign.siteId,
    grantedBy: 'promotion',
  })
  await deps.entitlementWriter.create(entitlement)

  // Create redemption record
  const redemption = createXPromotionRedemption({
    id: redemptionId,
    campaignId: campaign.id,
    userId: input.userId,
    xUserId: connection.xUserId,
    repostId: repostResult.repostId ?? `repost:${connection.xUserId}:${campaign.tweetId}`,
    entitlementId,
  })
  await deps.redemptionWriter.create(redemption)

  return {
    success: true,
    entitlementId,
  }
}
