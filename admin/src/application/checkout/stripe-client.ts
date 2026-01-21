import type { CheckoutMode } from '../../domain/checkout/checkout-session.js'

export interface CreateStripeCheckoutInput {
  priceId: string
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode: CheckoutMode
  customerEmail?: string
}

export interface StripeCheckoutResult {
  sessionId: string
  checkoutUrl: string
}

export interface StripeClient {
  createCheckoutSession(input: CreateStripeCheckoutInput): Promise<StripeCheckoutResult>
}
