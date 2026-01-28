import type { Env } from '../../../env.js'
import type { AuditLogger } from '../../../application/audit/audit-logger.js'
import { syncSiteProducts, type SyncProductsRequest, type ProductInput, type SubscriptionInput } from '../../../application/sync/sync-site-products.js'
import { D1ProductWriter } from '../../../infrastructure/db/d1-product-writer.js'
import { D1ProductPriceWriter } from '../../../infrastructure/db/d1-product-price-writer.js'
import { D1SiteRepository } from '../../../infrastructure/db/d1-site-repository.js'
import { createSite } from '../../../domain/sites/site.js'
import { logAudit } from '../../../application/audit/log-audit.js'

export async function handleSyncProducts(
  request: Request,
  env: Env,
  auditLogger?: AuditLogger | null
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = request.headers.get('X-Admin-Api-Key')
  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!isRecord(payload) || typeof payload.siteId !== 'string') {
    return new Response('Invalid payload: siteId is required', { status: 400 })
  }

  let syncRequest: SyncProductsRequest
  try {
    syncRequest = normalizeRequest(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload'
    return new Response(message, { status: 400 })
  }

  // Ensure the site exists (foreign key constraint) even if pages sync hasn't run yet
  const siteRepository = new D1SiteRepository(env.DB)
  await siteRepository.upsert(
    createSite({
      siteId: syncRequest.siteId,
      name: syncRequest.siteId
    })
  )

  const result = await syncSiteProducts(syncRequest, {
    productRepository: new D1ProductWriter(env.DB),
    priceRepository: new D1ProductPriceWriter(env.DB)
  })

  if (auditLogger) {
    await logAudit(
      {
        actorId: 'admin-sync',
        action: 'sync',
        resource: 'products',
        siteId: syncRequest.siteId,
        metadata: {
          productsUpserted: result.products.upserted,
          productsArchived: result.products.archived,
          pricesUpserted: result.prices.upserted,
          warnings: result.warnings.length
        }
      },
      auditLogger
    )
  }

  return new Response(JSON.stringify(result), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

function normalizeRequest(payload: Record<string, unknown>): SyncProductsRequest {
  const siteId = payload.siteId as string
  const products = normalizeProducts(payload.products)
  const subscription = normalizeSubscription(payload.subscription)
  const archiveMissing = normalizeArchiveMissing(payload.archiveMissing)

  return {
    siteId,
    products,
    subscription,
    archiveMissing
  }
}

function normalizeProducts(value: unknown): ProductInput[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => {
    if (!isRecord(item) || typeof item.id !== 'string') {
      throw new Error('Product must have an id')
    }

    const product: ProductInput = {
      id: item.id
    }

    if (typeof item.price === 'number') {
      product.price = item.price
    }
    if (typeof item.stripe_price_id === 'string') {
      product.stripe_price_id = item.stripe_price_id
    }
    if (typeof item.description === 'string') {
      product.description = item.description
    }
    if (isRecord(item.sale)) {
      product.sale = {
        price: Number(item.sale.price),
        starts_at: String(item.sale.starts_at),
        ends_at: String(item.sale.ends_at),
        label: typeof item.sale.label === 'string' ? item.sale.label : undefined
      }
    }

    return product
  })
}

function normalizeSubscription(value: unknown): SubscriptionInput | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  if (typeof value.id !== 'string' || typeof value.name !== 'string') {
    throw new Error('Subscription must have id and name')
  }

  const subscription: SubscriptionInput = {
    id: value.id,
    name: value.name
  }

  if (typeof value.stripe_price_id === 'string') {
    subscription.stripe_price_id = value.stripe_price_id
  }

  if (Array.isArray(value.prices)) {
    subscription.prices = value.prices.map((price) => {
      if (!isRecord(price)) {
        throw new Error('Invalid price in subscription')
      }

      const billingPeriod = price.billing_period as 'monthly' | 'yearly'
      if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
        throw new Error('Invalid billing_period: must be monthly or yearly')
      }

      const result: NonNullable<SubscriptionInput['prices']>[number] = {
        billing_period: billingPeriod,
        price: Number(price.price),
        stripe_price_id: String(price.stripe_price_id)
      }

      if (typeof price.label === 'string') {
        result.label = price.label
      }
      if (typeof price.badge === 'string') {
        result.badge = price.badge
      }
      if (isRecord(price.sale)) {
        result.sale = {
          price: Number(price.sale.price),
          starts_at: String(price.sale.starts_at),
          ends_at: String(price.sale.ends_at),
          label: typeof price.sale.label === 'string' ? price.sale.label : undefined,
          stripe_coupon_id: typeof price.sale.stripe_coupon_id === 'string' ? price.sale.stripe_coupon_id : undefined
        }
      }

      return result
    })
  }

  return subscription
}

function normalizeArchiveMissing(value: unknown): boolean | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'boolean') {
    throw new Error('archiveMissing must be a boolean')
  }
  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
