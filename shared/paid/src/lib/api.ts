/**
 * 有料コンテンツ関連のAPI関数
 */

import type {
  PaywallOptions,
  PaidContentError,
  FetchPaidContentParams,
  CreateCheckoutParams,
} from './types.js'

/**
 * Paywall情報を取得
 */
export async function fetchPaywallInfo(
  apiBaseUrl: string,
  siteId: string,
  productId: string
): Promise<PaywallOptions> {
  const params = new URLSearchParams({ siteId, productId })
  const response = await fetch(`${apiBaseUrl}/api/paywall?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * 有料コンテンツを取得
 */
export async function fetchPaidContent(
  apiBaseUrl: string,
  params: FetchPaidContentParams,
  accessToken: string
): Promise<string> {
  const searchParams = new URLSearchParams({
    siteId: params.siteId,
    slug: params.slug,
    sectionId: params.sectionId,
    productId: params.productId,
  })
  const response = await fetch(`${apiBaseUrl}/api/paid-content?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error: PaidContentError = {
      type: response.status === 401 ? 'unauthorized' :
            response.status === 403 ? 'forbidden' :
            response.status === 404 ? 'not_found' : 'network',
      message: errorData.error || `HTTP error! status: ${response.status}`,
    }
    throw error
  }

  const { html } = await response.json()
  return html
}

/**
 * 有料コンテンツへのアクセス可否を確認
 */
export async function checkPaidContentAccess(
  apiBaseUrl: string,
  params: FetchPaidContentParams,
  accessToken: string
): Promise<boolean> {
  const searchParams = new URLSearchParams({
    siteId: params.siteId,
    slug: params.slug,
    sectionId: params.sectionId,
    productId: params.productId,
  })
  const response = await fetch(`${apiBaseUrl}/api/paid-content?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  return response.ok
}

/**
 * Checkoutセッションを作成
 */
export async function createCheckoutSession(
  apiBaseUrl: string,
  params: CreateCheckoutParams,
  accessToken: string
): Promise<string> {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  // URLSearchParamsを使うと{CHECKOUT_SESSION_ID}がエンコードされてしまうため、
  // 手動で構築してプレースホルダーはそのまま残す
  const otherParams = new URLSearchParams({
    siteId: params.returnContext.siteId,
    slug: params.returnContext.slug,
    sectionId: params.returnContext.sectionId,
    productId: params.productId,
  })
  // {CHECKOUT_SESSION_ID}はStripeが置換するプレースホルダーなのでエンコードしない
  const successUrl = `${origin}/purchase-complete?session_id={CHECKOUT_SESSION_ID}&${otherParams}`
  const cancelUrl = `${origin}/${params.returnContext.slug}#${params.returnContext.sectionId}`

  const response = await fetch(`${apiBaseUrl}/api/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
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

  const { checkoutUrl } = await response.json()
  return checkoutUrl
}

/**
 * Stripe Checkout セッション状態を確認（フォールバック）
 * Webhookが届かなかった場合に、直接Stripeからセッション状態を取得し、
 * 支払い完了であればentitlementを作成する
 */
export async function verifyCheckoutSession(
  apiBaseUrl: string,
  sessionId: string,
  accessToken: string
): Promise<{ verified: boolean; error?: string }> {
  const params = new URLSearchParams({ sessionId })
  const response = await fetch(`${apiBaseUrl}/api/checkout/status?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    return { verified: false, error: data.error || 'Verification failed' }
  }

  const data = await response.json()
  return { verified: data.verified }
}
