import type { Env } from '../../../env.js'
import { syncProducts } from '../../../application/x-promotion/sync-products.js'
import { D1XPromotionCampaignWriter } from '../../../infrastructure/db/d1-x-promotion-campaign-writer.js'

export async function handleSyncProducts(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = request.headers.get('X-Admin-Api-Key')
  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!isRecord(payload) || typeof payload.siteId !== 'string' || !Array.isArray(payload.products)) {
    return new Response(
      JSON.stringify({ error: 'siteId and products are required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  try {
    const result = await syncProducts(
      {
        siteId: payload.siteId,
        products: payload.products.map((p) => normalizeProductInput(p)),
      },
      {
        campaignWriter: new D1XPromotionCampaignWriter(env.DB),
      }
    )

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}

interface ProductInput {
  id: string
  name: string
  x_promotion?: {
    tweet_id: string
    label?: string
    starts_at?: string
    ends_at?: string
  }
}

function normalizeProductInput(value: unknown): ProductInput {
  if (!isRecord(value)) {
    throw new Error('Invalid product payload')
  }

  const { id, name, x_promotion } = value
  if (typeof id !== 'string' || typeof name !== 'string') {
    throw new Error('id and name are required for each product')
  }

  const result: ProductInput = { id, name }

  if (isRecord(x_promotion)) {
    const { tweet_id, label, starts_at, ends_at } = x_promotion
    if (typeof tweet_id !== 'string') {
      throw new Error('tweet_id is required for x_promotion')
    }
    result.x_promotion = {
      tweet_id,
      label: typeof label === 'string' ? label : undefined,
      starts_at: typeof starts_at === 'string' ? starts_at : undefined,
      ends_at: typeof ends_at === 'string' ? ends_at : undefined,
    }
  }

  return result
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
