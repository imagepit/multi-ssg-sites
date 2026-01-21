import type { Env } from '../../../env.js'
import { handleCheckoutCompleted } from '../../../application/webhook/handle-checkout-completed.js'
import { handleSubscriptionDeleted } from '../../../application/webhook/handle-subscription-deleted.js'
import { StripeWebhookVerifierImpl } from '../../../infrastructure/stripe/stripe-webhook-verifier.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'
import { D1EntitlementReader } from '../../../infrastructure/db/d1-entitlement-reader.js'
import { D1EntitlementWriter } from '../../../infrastructure/db/d1-entitlement-writer.js'

export async function handleStripeWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Stripe is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const payload = await request.text()

  const verifier = new StripeWebhookVerifierImpl(
    env.STRIPE_SECRET_KEY,
    env.STRIPE_WEBHOOK_SECRET
  )

  let event
  try {
    event = await verifier.verifySignature(payload, signature)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const productReader = new D1ProductReader(env.DB)
  const entitlementReader = new D1EntitlementReader(env.DB)
  const entitlementWriter = new D1EntitlementWriter(env.DB)

  switch (event.type) {
    case 'checkout.session.completed': {
      const result = await handleCheckoutCompleted(event, {
        productReader,
        entitlementWriter,
        entitlementReader,
        generateId: () => crypto.randomUUID()
      })

      if (!result.success) {
        console.error('Failed to handle checkout.session.completed:', result.error)
        return new Response(JSON.stringify({ error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    case 'customer.subscription.deleted': {
      const result = await handleSubscriptionDeleted(event, {
        entitlementWriter,
        entitlementReader
      })

      if (!result.success) {
        console.error('Failed to handle customer.subscription.deleted:', result.error)
        return new Response(JSON.stringify({ error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  }
}
