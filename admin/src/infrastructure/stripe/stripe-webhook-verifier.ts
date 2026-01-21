import Stripe from 'stripe'
import type {
  StripeWebhookVerifier,
  StripeWebhookEvent
} from '../../application/webhook/stripe-webhook-verifier.js'

export class StripeWebhookVerifierImpl implements StripeWebhookVerifier {
  private stripe: Stripe
  private webhookSecret: string

  constructor(secretKey: string, webhookSecret: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover'
    })
    this.webhookSecret = webhookSecret
  }

  async verifySignature(
    payload: string,
    signature: string
  ): Promise<StripeWebhookEvent> {
    const event = await this.stripe.webhooks.constructEventAsync(
      payload,
      signature,
      this.webhookSecret
    )

    return {
      type: event.type,
      data: {
        object: event.data.object as unknown as Record<string, unknown>
      }
    }
  }
}
