import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { createCheckoutSession, type SalePriceInfo } from '../../../application/checkout/create-checkout-session.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'
import { D1ProductPriceReader } from '../../../infrastructure/db/d1-product-price-reader.js'
import { StripeCheckoutClient } from '../../../infrastructure/stripe/stripe-checkout-client.js'
import type { BillingPeriod, Product, ProductPrice } from '../../../domain/entitlement/product.js'

interface CheckoutRequestBody {
  productId: string
  successUrl: string
  cancelUrl: string
  mode?: 'payment' | 'subscription'
  billingPeriod?: BillingPeriod
}

/**
 * Check if a sale is currently active based on Unix timestamps
 */
function isOnSale(
  saleStartsAt: number | undefined,
  saleEndsAt: number | undefined,
  now: Date = new Date()
): boolean {
  if (saleStartsAt === undefined || saleEndsAt === undefined) {
    return false
  }
  const nowTimestamp = Math.floor(now.getTime() / 1000)
  return nowTimestamp >= saleStartsAt && nowTimestamp <= saleEndsAt
}

/**
 * Build SalePriceInfo from product if sale is active (for single purchase)
 */
function buildSalePriceFromProduct(product: Product): SalePriceInfo | undefined {
  if (!isOnSale(product.saleStartsAt, product.saleEndsAt)) {
    return undefined
  }
  if (product.salePrice === undefined) {
    return undefined
  }
  return {
    price: product.salePrice,
    originalPrice: product.price,
    label: product.saleLabel
  }
}

/**
 * Build SalePriceInfo from product price if sale is active (for subscription)
 */
function buildSalePriceFromProductPrice(productPrice: ProductPrice): SalePriceInfo | undefined {
  if (!isOnSale(productPrice.saleStartsAt, productPrice.saleEndsAt)) {
    return undefined
  }
  if (productPrice.salePrice === undefined) {
    return undefined
  }
  return {
    price: productPrice.salePrice,
    originalPrice: productPrice.price,
    label: productPrice.saleLabel,
    stripeCouponId: productPrice.stripeCouponId
  }
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
  const productPriceReader = new D1ProductPriceReader(env.DB)
  const stripeClient = new StripeCheckoutClient(env.STRIPE_SECRET_KEY)

  // サーバー側でセール情報を検証（クライアントから渡されたsalePriceは信用しない）
  let salePrice: SalePriceInfo | undefined
  let overrideStripePriceId: string | undefined

  if (body.mode === 'subscription' && body.billingPeriod) {
    // サブスクリプションの場合、billingPeriodからstripePriceIdとセール情報を取得
    const productPrice = await productPriceReader.findByProductAndBillingPeriod(
      body.productId,
      body.billingPeriod
    )
    if (!productPrice) {
      return new Response(
        JSON.stringify({ error: `Price not found for billing period: ${body.billingPeriod}` }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    overrideStripePriceId = productPrice.stripePriceId
    salePrice = buildSalePriceFromProductPrice(productPrice)
  } else {
    // 単体購入の場合、商品からセール情報を取得
    const product = await productReader.findById(body.productId)
    if (product) {
      salePrice = buildSalePriceFromProduct(product)
    }
  }

  const result = await createCheckoutSession(
    {
      userId: auth.sub,
      productId: body.productId,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      mode: body.mode,
      customerEmail: auth.email,
      overrideStripePriceId,
      salePrice
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
