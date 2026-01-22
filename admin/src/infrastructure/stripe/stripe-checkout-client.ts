import Stripe from 'stripe'
import type {
  StripeClient,
  CreateStripeCheckoutInput,
  StripeCheckoutResult
} from '../../application/checkout/stripe-client.js'

export class StripeCheckoutClient implements StripeClient {
  private stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover'
    })
  }

  async createCheckoutSession(
    input: CreateStripeCheckoutInput
  ): Promise<StripeCheckoutResult> {
    // Build line_items based on whether priceData (dynamic pricing) or priceId is provided
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = input.priceData
      ? [
          {
            price_data: {
              currency: input.priceData.currency,
              product_data: {
                name: input.priceData.productName,
              },
              unit_amount: input.priceData.unitAmount,
            },
            quantity: 1,
          },
        ]
      : [
          {
            price: input.priceId,
            quantity: 1,
          },
        ]

    // Build metadata with sale info if provided
    const metadata: Record<string, string> = {
      user_id: input.userId,
      product_id: input.productId,
    }
    if (input.priceData?.originalPrice !== undefined) {
      metadata.original_price = String(input.priceData.originalPrice)
    }
    if (input.priceData?.saleLabel) {
      metadata.sale_label = input.priceData.saleLabel
    }

    // Build discounts for subscription with coupon
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined =
      input.mode === 'subscription' && input.couponId
        ? [{ coupon: input.couponId }]
        : undefined

    const session = await this.stripe.checkout.sessions.create({
      mode: input.mode,
      line_items: lineItems,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata,
      discounts,
      subscription_data:
        input.mode === 'subscription'
          ? {
              metadata: {
                user_id: input.userId,
                product_id: input.productId,
              },
            }
          : undefined,
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session URL')
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url
    }
  }
}
