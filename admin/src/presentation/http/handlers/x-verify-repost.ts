import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { verifyRepostAndGrantAccess } from '../../../application/x-promotion/verify-repost-and-grant-access.js'
import { XApiClientImpl } from '../../../infrastructure/x/x-api-client-impl.js'
import { D1XUserConnectionReader } from '../../../infrastructure/db/d1-x-user-connection-reader.js'
import { D1XPromotionCampaignReader } from '../../../infrastructure/db/d1-x-promotion-campaign-reader.js'
import { D1XPromotionRedemptionReader } from '../../../infrastructure/db/d1-x-promotion-redemption-reader.js'
import { D1XPromotionRedemptionWriter } from '../../../infrastructure/db/d1-x-promotion-redemption-writer.js'
import { D1EntitlementWriter } from '../../../infrastructure/db/d1-entitlement-writer.js'

export async function handleXVerifyRepost(
  request: Request,
  env: Env,
  auth: AuthClaims
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET || !env.X_CALLBACK_URL) {
    return new Response(
      JSON.stringify({ error: 'X OAuth not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!isRecord(body) || typeof body.campaignId !== 'string') {
    return new Response(
      JSON.stringify({ error: 'campaignId is required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  try {
    const xApiClient = new XApiClientImpl({
      clientId: env.X_CLIENT_ID,
      clientSecret: env.X_CLIENT_SECRET,
      callbackUrl: env.X_CALLBACK_URL,
    })

    const result = await verifyRepostAndGrantAccess(
      {
        userId: auth.sub,
        campaignId: body.campaignId,
      },
      {
        xApiClient,
        connectionReader: new D1XUserConnectionReader(env.DB),
        campaignReader: new D1XPromotionCampaignReader(env.DB),
        redemptionReader: new D1XPromotionRedemptionReader(env.DB),
        redemptionWriter: new D1XPromotionRedemptionWriter(env.DB),
        entitlementWriter: new D1EntitlementWriter(env.DB),
        generateId: () => crypto.randomUUID(),
      }
    )

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          entitlementId: result.entitlementId,
        }),
        { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    // Map failure reasons to appropriate responses
    const errorMessages: Record<string, { message: string; status: number }> = {
      repost_not_found: {
        message: 'リポストが確認できませんでした。リポストしてから再度お試しください。',
        status: 400,
      },
      already_redeemed: {
        message: 'すでにこのキャンペーンは利用済みです。',
        status: 409,
      },
      campaign_ended: {
        message: 'このキャンペーンは終了しました。',
        status: 410,
      },
    }

    const errorInfo = result.reason ? errorMessages[result.reason] : undefined
    const message = errorInfo?.message ?? 'Unknown error'
    const status = errorInfo?.status ?? 400

    return new Response(
      JSON.stringify({
        success: false,
        reason: result.reason,
        error: message,
      }),
      { status, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    // Handle specific error cases
    if (message === 'X connection not found') {
      return new Response(
        JSON.stringify({
          success: false,
          reason: 'x_not_connected',
          error: 'X連携が必要です。先にX連携を行ってください。',
        }),
        { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    if (message === 'Campaign not found') {
      return new Response(
        JSON.stringify({
          success: false,
          reason: 'campaign_not_found',
          error: 'キャンペーンが見つかりません。',
        }),
        { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
