import type { Product, ProductPrice, ProductType, BillingPeriod } from '../../domain/entitlement/product.js'
import type { ProductSyncRepository, ProductPriceSyncRepository } from './product-sync-repository.js'

/**
 * Sale input from MDX frontmatter (ISO 8601 dates)
 */
export interface SaleInput {
  price: number
  starts_at: string
  ends_at: string
  label?: string
}

/**
 * Product input from MDX frontmatter
 */
export interface ProductInput {
  id: string
  price?: number
  stripe_price_id?: string
  description?: string
  sale?: SaleInput
}

/**
 * Price input for subscription products
 */
export interface ProductPriceInput {
  billing_period: BillingPeriod
  price: number
  stripe_price_id: string
  label?: string
  badge?: string
  sale?: SaleInput & { stripe_coupon_id?: string }
}

/**
 * Subscription product input from spec.json
 */
export interface SubscriptionInput {
  id: string
  name: string
  stripe_price_id?: string
  prices?: ProductPriceInput[]
}

export interface SyncProductsRequest {
  siteId: string
  /** Products from MDX frontmatter (single purchase) */
  products: ProductInput[]
  /** Subscription product from spec.json */
  subscription?: SubscriptionInput
}

export interface SyncProductsDependencies {
  productRepository: ProductSyncRepository
  priceRepository: ProductPriceSyncRepository
}

export interface SyncProductsResult {
  products: {
    upserted: number
    archived: number
  }
  prices: {
    upserted: number
    deleted: number
  }
  warnings: string[]
}

/**
 * Validate sale dates
 * @returns true if valid, false otherwise
 */
function validateSaleDates(startsAt: string, endsAt: string): { valid: boolean; reason?: string } {
  const start = new Date(startsAt)
  const end = new Date(endsAt)

  if (isNaN(start.getTime())) {
    return { valid: false, reason: `Invalid starts_at date: ${startsAt}` }
  }
  if (isNaN(end.getTime())) {
    return { valid: false, reason: `Invalid ends_at date: ${endsAt}` }
  }
  if (start >= end) {
    return { valid: false, reason: `Sale starts_at >= ends_at: ${startsAt} >= ${endsAt}` }
  }

  return { valid: true }
}

/**
 * Convert ISO 8601 date string to Unix timestamp (seconds)
 */
function isoToUnixTimestamp(iso: string): number {
  return Math.floor(new Date(iso).getTime() / 1000)
}

/**
 * Build product ID with site prefix to avoid collisions
 * Format: {siteId}:{originalId}
 */
function buildProductId(siteId: string, originalId: string): string {
  // If already prefixed, return as-is
  if (originalId.startsWith(`${siteId}:`)) {
    return originalId
  }
  return `${siteId}:${originalId}`
}

/**
 * Sync site products to the database
 */
export async function syncSiteProducts(
  input: SyncProductsRequest,
  deps: SyncProductsDependencies
): Promise<SyncProductsResult> {
  const { siteId, products, subscription } = input
  const warnings: string[] = []
  const now = new Date().toISOString()

  const processedProductIds: string[] = []
  let productsUpserted = 0
  let pricesUpserted = 0
  let pricesDeleted = 0

  // Process single products from MDX frontmatter
  for (const productInput of products) {
    const productId = buildProductId(siteId, productInput.id)

    // Process sale if present
    let salePrice: number | undefined
    let saleStartsAt: number | undefined
    let saleEndsAt: number | undefined
    let saleLabel: string | undefined

    if (productInput.sale) {
      const validation = validateSaleDates(productInput.sale.starts_at, productInput.sale.ends_at)
      if (validation.valid) {
        salePrice = productInput.sale.price
        saleStartsAt = isoToUnixTimestamp(productInput.sale.starts_at)
        saleEndsAt = isoToUnixTimestamp(productInput.sale.ends_at)
        saleLabel = productInput.sale.label
      } else {
        warnings.push(`Product ${productInput.id}: ${validation.reason}`)
      }
    }

    const product: Product = {
      id: productId,
      name: productInput.id, // Use ID as name for single products
      siteId,
      price: productInput.price ?? 0,
      currency: 'JPY',
      status: 'active',
      stripePriceId: productInput.stripe_price_id ?? null,
      productType: 'single' as ProductType,
      description: productInput.description,
      salePrice,
      saleStartsAt,
      saleEndsAt,
      saleLabel,
      createdAt: now,
      updatedAt: now
    }

    await deps.productRepository.upsert(product)
    processedProductIds.push(productId)
    productsUpserted++
  }

  // Process subscription product from spec.json
  if (subscription) {
    const productId = buildProductId(siteId, subscription.id)

    const product: Product = {
      id: productId,
      name: subscription.name,
      siteId,
      price: 0, // Price is stored in product_prices for subscriptions
      currency: 'JPY',
      status: 'active',
      stripePriceId: subscription.stripe_price_id ?? null,
      productType: 'subscription' as ProductType,
      createdAt: now,
      updatedAt: now
    }

    await deps.productRepository.upsert(product)
    processedProductIds.push(productId)
    productsUpserted++

    // Delete existing prices and recreate
    await deps.priceRepository.deleteByProductId(productId)
    pricesDeleted++

    // Process subscription prices
    if (subscription.prices) {
      for (const priceInput of subscription.prices) {
        // Process sale if present
        let salePrice: number | undefined
        let saleStartsAt: number | undefined
        let saleEndsAt: number | undefined
        let saleLabel: string | undefined
        let stripeCouponId: string | undefined

        if (priceInput.sale) {
          const validation = validateSaleDates(priceInput.sale.starts_at, priceInput.sale.ends_at)
          if (validation.valid) {
            salePrice = priceInput.sale.price
            saleStartsAt = isoToUnixTimestamp(priceInput.sale.starts_at)
            saleEndsAt = isoToUnixTimestamp(priceInput.sale.ends_at)
            saleLabel = priceInput.sale.label
            stripeCouponId = priceInput.sale.stripe_coupon_id
          } else {
            warnings.push(`Subscription ${subscription.id} price ${priceInput.billing_period}: ${validation.reason}`)
          }
        }

        const priceId = `${productId}:${priceInput.billing_period}`
        const price: ProductPrice = {
          id: priceId,
          productId,
          billingPeriod: priceInput.billing_period,
          price: priceInput.price,
          stripePriceId: priceInput.stripe_price_id,
          label: priceInput.label,
          badge: priceInput.badge,
          salePrice,
          saleStartsAt,
          saleEndsAt,
          saleLabel,
          stripeCouponId,
          createdAt: now
        }

        await deps.priceRepository.upsert(price)
        pricesUpserted++
      }
    }
  }

  // Archive products that are no longer in the sync
  const archived = await deps.productRepository.archiveMissing(siteId, processedProductIds)

  return {
    products: {
      upserted: productsUpserted,
      archived
    },
    prices: {
      upserted: pricesUpserted,
      deleted: pricesDeleted
    },
    warnings
  }
}
