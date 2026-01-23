'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { XPromotionOption } from '../components/PremiumPlaceholder.js'

/**
 * Product definition from frontmatter
 */
export interface PageProduct {
  /** Product identifier (e.g., "product:course-dx-intro") */
  id: string
  /** Optional price in JPY */
  price?: number
  /** Optional description */
  description?: string
  /** X promotion configuration */
  xPromotion?: XPromotionOption
}

/**
 * Context value for page products
 */
export interface PageProductsContextValue {
  /** Products defined in the page frontmatter */
  products: PageProduct[]
  /** Get product by ID */
  getProduct: (productId: string) => PageProduct | undefined
  /** Get X promotion option for a product */
  getXPromotionOption: (productId: string) => XPromotionOption | undefined
}

const PageProductsContext = createContext<PageProductsContextValue | null>(null)

/**
 * Hook to access page products context
 * @returns Context value or null if not within provider
 */
export function usePageProducts(): PageProductsContextValue | null {
  return useContext(PageProductsContext)
}

/**
 * Hook to get X promotion option for a specific product
 * @param productId Product identifier
 * @returns X promotion option or undefined
 */
export function useXPromotionOption(productId: string): XPromotionOption | undefined {
  const context = useContext(PageProductsContext)
  return context?.getXPromotionOption(productId)
}

export interface PageProductsProviderProps {
  /** Site ID for campaign ID generation */
  siteId: string
  /** Products from frontmatter (raw format) */
  products: Array<{
    id: string
    price?: number
    description?: string
    x_promotion?: {
      tweet_id: string
      tweet_url?: string
      label?: string
      starts_at?: string
      ends_at?: string
    }
  }>
  children: ReactNode
}

/**
 * Extract slug from product ID
 * e.g., "product:remotion-skills" -> "remotion-skills"
 */
function extractSlugFromProductId(productId: string): string {
  const parts = productId.split(':')
  return parts.length > 1 ? parts.slice(1).join(':') : productId
}

/**
 * Generate campaign ID from product ID and site ID
 * Must match backend logic in admin/src/application/x-promotion/sync-products.ts
 */
function generateCampaignId(productId: string, siteId: string): string {
  const slug = extractSlugFromProductId(productId)
  return `xpc:${siteId}:${slug}`
}

/**
 * Generate tweet URL from tweet ID if not provided
 */
function generateTweetUrl(tweetId: string): string {
  return `https://x.com/i/status/${tweetId}`
}

/**
 * Transform raw frontmatter product to PageProduct
 */
function transformProduct(raw: PageProductsProviderProps['products'][number], siteId: string): PageProduct {
  const product: PageProduct = {
    id: raw.id,
    price: raw.price,
    description: raw.description,
  }

  if (raw.x_promotion) {
    const xp = raw.x_promotion
    product.xPromotion = {
      campaignId: generateCampaignId(raw.id, siteId),
      tweetId: xp.tweet_id,
      tweetUrl: xp.tweet_url || generateTweetUrl(xp.tweet_id),
      label: xp.label || '拡散で応援して無料で読む',
      endsAt: xp.ends_at,
    }
  }

  return product
}

/**
 * Provider component for page products context
 */
export function PageProductsProvider({ siteId, products: rawProducts, children }: PageProductsProviderProps) {
  const products = rawProducts.map((raw) => transformProduct(raw, siteId))

  const getProduct = (productId: string): PageProduct | undefined => {
    return products.find(p => p.id === productId)
  }

  const getXPromotionOption = (productId: string): XPromotionOption | undefined => {
    const product = getProduct(productId)
    return product?.xPromotion
  }

  const value: PageProductsContextValue = {
    products,
    getProduct,
    getXPromotionOption,
  }

  return (
    <PageProductsContext.Provider value={value}>
      {children}
    </PageProductsContext.Provider>
  )
}
