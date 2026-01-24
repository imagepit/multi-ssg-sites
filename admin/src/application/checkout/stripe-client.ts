import type { CheckoutMode } from '../../domain/checkout/checkout-session.js'

/** Dynamic price data for one-time payments (セール対応) */
export interface PriceData {
  /** Currency code (e.g., 'jpy') */
  currency: string
  /** Product name displayed in checkout */
  productName: string
  /** Price amount in smallest currency unit (e.g., yen for JPY) */
  unitAmount: number
  /** Original price (for metadata) */
  originalPrice?: number
  /** Sale label (for metadata) */
  saleLabel?: string
}

export interface CreateStripeCheckoutInput {
  /** Stripe Price ID (required if priceData is not provided) */
  priceId?: string
  /** Dynamic price data for one-time payments (alternative to priceId) */
  priceData?: PriceData
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode: CheckoutMode
  customerEmail?: string
  /** Stripe Coupon ID for subscription discounts */
  couponId?: string
}

export interface StripeCheckoutResult {
  sessionId: string
  checkoutUrl: string
}

export interface CheckoutSessionStatus {
  sessionId: string
  status: 'complete' | 'expired' | 'open'
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required'
  metadata: {
    userId?: string
    productId?: string
  }
}

export interface StripeClient {
  createCheckoutSession(input: CreateStripeCheckoutInput): Promise<StripeCheckoutResult>
  getCheckoutSession(sessionId: string): Promise<CheckoutSessionStatus>
}
