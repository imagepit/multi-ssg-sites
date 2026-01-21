import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { createCheckoutSession } from '../../../application/checkout/create-checkout-session.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'
import { StripeCheckoutClient } from '../../../infrastructure/stripe/stripe-checkout-client.js'

interface CheckoutRequestBody {
  productId: string
  successUrl: string
  cancelUrl: string
  mode?: 'payment' | 'subscription'
}

export async function handleCheckoutCreate(
  request: Request,
  env: Env,
  auth: AuthClaims
): Promise<Response> {
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

  let body: CheckoutRequestBody
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!body.productId || !body.successUrl || !body.cancelUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: productId, successUrl, cancelUrl' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  const productReader = new D1ProductReader(env.DB)
  const stripeClient = new StripeCheckoutClient(env.STRIPE_SECRET_KEY)

  const result = await createCheckoutSession(
    {
      userId: auth.sub,
      productId: body.productId,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      mode: body.mode,
      customerEmail: auth.email
    },
    { productReader, stripeClient }
  )

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(
    JSON.stringify({
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
