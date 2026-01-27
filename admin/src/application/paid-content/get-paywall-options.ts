import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { ProductPriceReadRepository } from '../entitlement/product-price-repository.js'
import type { BillingPeriod } from '../../domain/entitlement/product.js'

export interface GetPaywallOptionsInput {
  siteId: string
  productId: string
}

/** Active sale information for display */
export interface SaleInfo {
  /** Sale price */
  price: number
  /** Original price before discount */
  originalPrice: number
  /** Sale label */
  label: string
  /** Sale start time (ISO 8601) */
  startsAt: string
  /** Sale end time (ISO 8601) */
  endsAt: string
  /** Stripe Coupon ID for subscription discounts */
  stripeCouponId?: string
}

export interface SinglePurchaseOption {
  productId: string
  price: number
  description?: string
  stripePriceId: string
  /** Active sale information */
  sale?: SaleInfo
}

export interface SubscriptionPriceOption {
  billingPeriod: BillingPeriod
  price: number
  stripePriceId: string
  label?: string
  badge?: string
  /** Active sale information */
  sale?: SaleInfo
}

export interface SubscriptionOption {
  productId: string
  name: string
  description?: string
  prices: SubscriptionPriceOption[]
}

export interface PaywallOptions {
  singlePurchase?: SinglePurchaseOption
  subscription?: SubscriptionOption
}

export interface GetPaywallOptionsDeps {
  productRepo: ProductReadRepository
  productPriceRepo: ProductPriceReadRepository
}

/** Default sale label */
const DEFAULT_SALE_LABEL = 'セール中'

/**
 * Check if a sale is currently active based on Unix timestamps
 */
function isOnSale(
  saleStartsAt: number | undefined,
  saleEndsAt: number | undefined,
  now: Date = new Date()
): boolean {
  if (saleStartsAt === undefined || saleEndsAt === undefined) {
    return false
  }
  const nowTimestamp = Math.floor(now.getTime() / 1000)
  return nowTimestamp >= saleStartsAt && nowTimestamp <= saleEndsAt
}

/**
 * Convert Unix timestamp to ISO 8601 string
 */
function timestampToIso(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString()
}

/**
 * Build SaleInfo from sale fields if sale is active
 */
function buildSaleInfo(
  originalPrice: number,
  salePrice: number | undefined,
  saleStartsAt: number | undefined,
  saleEndsAt: number | undefined,
  saleLabel: string | undefined,
  stripeCouponId?: string
): SaleInfo | undefined {
  if (!isOnSale(saleStartsAt, saleEndsAt)) {
    return undefined
  }
  if (salePrice === undefined || saleStartsAt === undefined || saleEndsAt === undefined) {
    return undefined
  }
  return {
    price: salePrice,
    originalPrice,
    label: saleLabel ?? DEFAULT_SALE_LABEL,
    startsAt: timestampToIso(saleStartsAt),
    endsAt: timestampToIso(saleEndsAt),
    stripeCouponId,
  }
}

export async function getPaywallOptions(
  input: GetPaywallOptionsInput,
  deps: GetPaywallOptionsDeps
): Promise<PaywallOptions> {
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }

  // Product ID in D1 is stored as "siteId:productId" format
  const fullProductId = `${input.siteId}:${input.productId}`
  const product = await deps.productRepo.findById(fullProductId)
  if (!product) {
    throw new Error('Product not found')
  }

  const result: PaywallOptions = {}

  // 単体購入オプション（productTypeがsingleの場合のみ）
  if (product.productType === 'single' && product.stripePriceId) {
    const sale = buildSaleInfo(
      product.price,
      product.salePrice,
      product.saleStartsAt,
      product.saleEndsAt,
      product.saleLabel
    )
    result.singlePurchase = {
      productId: product.id,
      price: product.price,
      description: product.description,
      stripePriceId: product.stripePriceId,
      sale,
    }
  }

  // サブスクリプションオプション
  const subscriptionProduct =
    product.productType === 'subscription'
      ? product
      : await deps.productRepo.findSubscriptionBySiteId(input.siteId)

  if (subscriptionProduct) {
    const prices = await deps.productPriceRepo.findByProductId(
      subscriptionProduct.id
    )

    if (prices.length > 0) {
      result.subscription = {
        productId: subscriptionProduct.id,
        name: subscriptionProduct.name,
        description: subscriptionProduct.description,
        prices: prices.map((p) => {
          const sale = buildSaleInfo(
            p.price,
            p.salePrice,
            p.saleStartsAt,
            p.saleEndsAt,
            p.saleLabel,
            p.stripeCouponId
          )
          return {
            billingPeriod: p.billingPeriod,
            price: p.price,
            stripePriceId: p.stripePriceId,
            label: p.label,
            badge: p.badge,
            sale,
          }
        })
      }
    }
  }

  return result
}
