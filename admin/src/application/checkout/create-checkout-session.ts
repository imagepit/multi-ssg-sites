import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { StripeClient } from './stripe-client.js'
import type { CheckoutMode } from '../../domain/checkout/checkout-session.js'
import {
  createCheckoutSessionRequest,
  validateCheckoutSessionRequest
} from '../../domain/checkout/checkout-session.js'

/** Sale price info for checkout */
export interface SalePriceInfo {
  /** Sale price amount */
  price: number
  /** Original price before discount */
  originalPrice: number
  /** Sale label */
  label?: string
  /** Stripe Coupon ID for subscription discounts */
  stripeCouponId?: string
}

export interface CreateCheckoutSessionInput {
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode?: CheckoutMode
  customerEmail?: string
  overrideStripePriceId?: string
  /** Sale price info (for applying discounts) */
  salePrice?: SalePriceInfo
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

  const stripePriceId = input.overrideStripePriceId ?? product.stripePriceId

  // For single purchase with sale price, use dynamic pricing (price_data)
  // For subscription with sale, use Stripe Coupon
  const useDynamicPricing =
    request.mode === 'payment' &&
    input.salePrice !== undefined

  if (!useDynamicPricing && !stripePriceId) {
    return { success: false, error: 'Product is not configured for Stripe payment' }
  }

  const stripeResult = await deps.stripeClient.createCheckoutSession({
    priceId: useDynamicPricing ? undefined : stripePriceId!,
    priceData: useDynamicPricing && input.salePrice
      ? {
          currency: product.currency.toLowerCase(),
          productName: product.name,
          unitAmount: input.salePrice.price,
          originalPrice: input.salePrice.originalPrice,
          saleLabel: input.salePrice.label,
        }
      : undefined,
    userId: input.userId,
    productId: input.productId,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    mode: request.mode,
    customerEmail: input.customerEmail,
    couponId: request.mode === 'subscription' ? input.salePrice?.stripeCouponId : undefined,
  })

  return {
    success: true,
    checkoutUrl: stripeResult.checkoutUrl,
    sessionId: stripeResult.sessionId
  }
}
