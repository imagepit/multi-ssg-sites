/**
 * Checkout API関数
 * Pure関数としてテスト可能
 */

/**
 * 購入完了後の復元用コンテキスト
 */
export interface ReturnContext {
  siteId: string
  slug: string
  sectionId: string
}

/**
 * Checkout作成パラメータ
 */
export interface CreateCheckoutParams {
  productId: string
  stripePriceId: string
  mode: 'payment' | 'subscription'
  billingPeriod?: 'monthly' | 'yearly'
  returnContext: ReturnContext
  apiBaseUrl: string
  accessToken: string
}

/**
 * Checkoutセッション作成レスポンス
 */
export interface CheckoutResponse {
  checkoutUrl: string
  sessionId: string
}

/**
 * Success URL を構築
 */
export function buildSuccessUrl(
  origin: string,
  returnContext: ReturnContext
): string {
  const params = new URLSearchParams({
    session_id: '{CHECKOUT_SESSION_ID}',
    siteId: returnContext.siteId,
    slug: returnContext.slug,
    sectionId: returnContext.sectionId,
  })
  return `${origin}/purchase-complete?${params}`
}

/**
 * Cancel URL を構築
 */
export function buildCancelUrl(
  origin: string,
  slug: string,
  sectionId: string
): string {
  return `${origin}/${slug}#${sectionId}`
}

/**
 * Checkoutセッション作成APIを呼び出し
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutResponse> {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const successUrl = buildSuccessUrl(origin, params.returnContext)
  const cancelUrl = buildCancelUrl(origin, params.returnContext.slug, params.returnContext.sectionId)

  const response = await fetch(`${params.apiBaseUrl}/api/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${params.accessToken}`,
    },
    body: JSON.stringify({
      productId: params.productId,
      stripePriceId: params.stripePriceId,
      mode: params.mode,
      billingPeriod: params.billingPeriod,
      successUrl,
      cancelUrl,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Checkout creation failed (${response.status})`)
  }

  return response.json()
}
