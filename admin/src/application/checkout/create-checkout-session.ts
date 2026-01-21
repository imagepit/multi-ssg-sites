import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { StripeClient } from './stripe-client.js'
import type { CheckoutMode } from '../../domain/checkout/checkout-session.js'
import {
  createCheckoutSessionRequest,
  validateCheckoutSessionRequest
} from '../../domain/checkout/checkout-session.js'

export interface CreateCheckoutSessionInput {
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode?: CheckoutMode
  customerEmail?: string
}

export interface CreateCheckoutSessionDeps {
  productReader: ProductReadRepository
  stripeClient: StripeClient
}

export type CreateCheckoutSessionResult =
  | { success: true; checkoutUrl: string; sessionId: string }
  | { success: false; error: string }

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
  deps: CreateCheckoutSessionDeps
): Promise<CreateCheckoutSessionResult> {
  const request = createCheckoutSessionRequest({
    userId: input.userId,
    productId: input.productId,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    mode: input.mode
  })

  const validationError = validateCheckoutSessionRequest(request)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const product = await deps.productReader.findById(input.productId)
  if (!product) {
    return { success: false, error: 'Product not found' }
  }

  if (product.status !== 'active') {
    return { success: false, error: 'Product is not available' }
  }

  if (!product.stripePriceId) {
    return { success: false, error: 'Product is not configured for Stripe payment' }
  }

  const stripeResult = await deps.stripeClient.createCheckoutSession({
    priceId: product.stripePriceId,
    userId: input.userId,
    productId: input.productId,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    mode: request.mode,
    customerEmail: input.customerEmail
  })

  return {
    success: true,
    checkoutUrl: stripeResult.checkoutUrl,
    sessionId: stripeResult.sessionId
  }
}
