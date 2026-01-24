import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { verifyCheckoutSession } from '../../../application/checkout/verify-checkout-session.js'
import { StripeCheckoutClient } from '../../../infrastructure/stripe/stripe-checkout-client.js'
import { D1EntitlementReader } from '../../../infrastructure/db/d1-entitlement-reader.js'
import { D1EntitlementWriter } from '../../../infrastructure/db/d1-entitlement-writer.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'

export async function handleCheckoutStatus(
  request: Request,
  env: Env,
  auth: AuthClaims
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.STRIPE_SECRET_KEY) {
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

  const url = new URL(request.url)
  const sessionId = url.searchParams.get('sessionId')

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'sessionId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const stripeClient = new StripeCheckoutClient(env.STRIPE_SECRET_KEY)
  const entitlementReader = new D1EntitlementReader(env.DB)
  const entitlementWriter = new D1EntitlementWriter(env.DB)
  const productReader = new D1ProductReader(env.DB)

  const result = await verifyCheckoutSession(
    {
      sessionId,
      userId: auth.sub
    },
    {
      stripeClient,
      entitlementReader,
      entitlementWriter,
      productReader,
      generateId: () => crypto.randomUUID()
    }
  )

  if (result.error) {
    return new Response(
      JSON.stringify({
        verified: result.verified,
        status: result.status,
        paymentStatus: result.paymentStatus,
        error: result.error
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      verified: result.verified,
      status: result.status,
      paymentStatus: result.paymentStatus,
      entitlementCreated: result.entitlementCreated
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
