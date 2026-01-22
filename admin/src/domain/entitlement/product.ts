export type ProductStatus = 'active' | 'archived'
export type ProductType = 'single' | 'subscription'
export type BillingPeriod = 'monthly' | 'yearly'

export interface Product {
  id: string
  name: string
  siteId: string
  price: number
  currency: string
  status: ProductStatus
  stripePriceId: string | null
  productType: ProductType
  description?: string
  /** Sale price in JPY */
  salePrice?: number
  /** Sale start time (Unix timestamp in seconds) */
  saleStartsAt?: number
  /** Sale end time (Unix timestamp in seconds) */
  saleEndsAt?: number
  /** Sale label (default: "セール中") */
  saleLabel?: string
  createdAt: string
  updatedAt: string
}

export interface ProductPrice {
  id: string
  productId: string
  billingPeriod: BillingPeriod
  price: number
  stripePriceId: string
  label?: string
  badge?: string
  /** Sale price in JPY */
  salePrice?: number
  /** Sale start time (Unix timestamp in seconds) */
  saleStartsAt?: number
  /** Sale end time (Unix timestamp in seconds) */
  saleEndsAt?: number
  /** Sale label (default: "セール中") */
  saleLabel?: string
  /** Stripe Coupon ID for subscription discounts */
  stripeCouponId?: string
  createdAt: string
}

export interface CreateProductInput {
  id: string
  name: string
  siteId: string
  price?: number
  currency?: string
  status?: ProductStatus
  stripePriceId?: string | null
  productType?: ProductType
  description?: string
}

export interface CreateProductPriceInput {
  id: string
  productId: string
  billingPeriod: BillingPeriod
  price: number
  stripePriceId: string
  label?: string
  badge?: string
}

export function createProduct(input: CreateProductInput): Product {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.name) {
    throw new Error('name is required')
  }
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (input.price !== undefined && input.price < 0) {
    throw new Error('price must be non-negative')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    name: input.name.trim(),
    siteId: input.siteId,
    price: input.price ?? 0,
    currency: input.currency ?? 'JPY',
    status: input.status ?? 'active',
    stripePriceId: input.stripePriceId ?? null,
    productType: input.productType ?? 'single',
    description: input.description,
    createdAt: now,
    updatedAt: now
  }
}

export function createProductPrice(input: CreateProductPriceInput): ProductPrice {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }
  if (!input.stripePriceId) {
    throw new Error('stripePriceId is required')
  }
  if (input.price < 0) {
    throw new Error('price must be non-negative')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    productId: input.productId,
    billingPeriod: input.billingPeriod,
    price: input.price,
    stripePriceId: input.stripePriceId,
    label: input.label,
    badge: input.badge,
    createdAt: now
  }
}

export function isSubscriptionProduct(product: Product): boolean {
  return product.productType === 'subscription'
}
