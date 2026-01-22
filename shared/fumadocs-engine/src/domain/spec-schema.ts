import { z } from 'zod'

/**
 * Sale schema for time-limited discounts
 */
export const saleSchema = z.object({
  /** Sale price in JPY */
  price: z.number(),
  /** Sale start time (ISO 8601) */
  starts_at: z.string(),
  /** Sale end time (ISO 8601) */
  ends_at: z.string(),
  /** Sale label (default: "セール中") */
  label: z.string().optional(),
  /** Stripe Coupon ID for subscription discounts */
  stripe_coupon_id: z.string().optional(),
})

/** Subscription price schema for spec.json */
export const subscriptionPriceSchema = z.object({
  billing_period: z.enum(['monthly', 'yearly']),
  price: z.number(),
  stripe_price_id: z.string(),
  label: z.string().optional(),
  badge: z.string().optional(),
  /** Optional sale configuration */
  sale: saleSchema.optional(),
})

/** Subscription schema for spec.json */
export const subscriptionSchema = z.object({
  product_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  prices: z.array(subscriptionPriceSchema).min(1),
})

/** Site spec schema */
export const siteSpecSchema = z.object({
  tech_keyword_id: z.string(),
  subscription: subscriptionSchema.optional(),
})

export type Sale = z.infer<typeof saleSchema>
export type SubscriptionPrice = z.infer<typeof subscriptionPriceSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
export type SiteSpec = z.infer<typeof siteSpecSchema>
