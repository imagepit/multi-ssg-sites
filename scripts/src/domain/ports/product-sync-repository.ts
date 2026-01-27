/**
 * Product information extracted from MDX frontmatter
 */
export type ProductInfo = {
  id: string
  price?: number
  stripe_price_id?: string
  description?: string
  sale?: {
    price: number
    starts_at: string
    ends_at: string
    label?: string
  }
}

/**
 * Subscription information extracted from MDX frontmatter
 */
export type SubscriptionInfo = {
  id: string
  name: string
  stripe_price_id?: string
  prices?: Array<{
    billing_period: 'monthly' | 'yearly'
    price: number
    stripe_price_id: string
    label?: string
    badge?: string
    sale?: {
      price: number
      starts_at: string
      ends_at: string
      label?: string
      stripe_coupon_id?: string
    }
  }>
}

/**
 * Request payload for syncing products to admin API
 */
export type SyncProductsPayload = {
  siteId: string
  products: ProductInfo[]
  subscription?: SubscriptionInfo
}

/**
 * Response from admin API after syncing products
 */
export type SyncProductsResult = {
  products: {
    upserted: number
    archived: number
  }
  prices: {
    upserted: number
  }
  warnings: string[]
}

/**
 * Configuration for admin API connection
 */
export type AdminApiConfig = {
  baseUrl: string
  apiKey: string
}

/**
 * Repository interface for syncing products to admin API
 */
export interface ProductSyncRepository {
  syncProducts(payload: SyncProductsPayload, config: AdminApiConfig): Promise<SyncProductsResult>
}
