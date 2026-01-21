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
    const session = await this.stripe.checkout.sessions.create({
      mode: input.mode,
      line_items: [
        {
          price: input.priceId,
          quantity: 1
        }
      ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata: {
        user_id: input.userId,
        product_id: input.productId
      },
      subscription_data:
        input.mode === 'subscription'
          ? {
              metadata: {
                user_id: input.userId,
                product_id: input.productId
              }
            }
          : undefined
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
