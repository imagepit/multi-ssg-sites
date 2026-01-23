import type { Env } from '../../../env.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'
import { D1ProductPriceReader } from '../../../infrastructure/db/d1-product-price-reader.js'
import { D1XPromotionCampaignReader } from '../../../infrastructure/db/d1-x-promotion-campaign-reader.js'
import { getPaywallOptions } from '../../../application/paid-content/get-paywall-options.js'

export async function handleGetPaywallOptions(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  const url = new URL(request.url)
  const siteId = url.searchParams.get('siteId')
  const productId = url.searchParams.get('productId')

  if (!siteId || !productId) {
    return new Response(
      JSON.stringify({ error: 'siteId and productId are required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  const productRepo = new D1ProductReader(env.DB)
  const productPriceRepo = new D1ProductPriceReader(env.DB)
  const campaignRepo = new D1XPromotionCampaignReader(env.DB)

  try {
    const options = await getPaywallOptions(
      { siteId, productId },
      { productRepo, productPriceRepo, campaignRepo }
    )

    return new Response(
      JSON.stringify(options),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    if (message === 'Product not found') {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
