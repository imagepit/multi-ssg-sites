/**
 * Paywall API関数
 * Pure関数としてテスト可能
 */

/**
 * サブスクリプション価格オプション
 */
export interface SubscriptionPriceOption {
  billingPeriod: 'monthly' | 'yearly'
  price: number
  stripePriceId: string
  label?: string
  badge?: string
}

/**
 * サブスクリプションオプション
 */
export interface SubscriptionOption {
  productId: string
  name: string
  description?: string
  prices: SubscriptionPriceOption[]
}

/**
 * Paywall情報
 */
export interface PaywallInfo {
  productId: string
  productName: string
  price: number
  currency: string
  stripePriceId: string
  description?: string
  /** セール価格 */
  salePrice?: number
  /** セール終了日時（Unix timestamp） */
  saleEndsAt?: number
  /** セールラベル */
  saleLabel?: string
  /** サブスクリプションオプション */
  subscriptionOptions?: SubscriptionOption[]
}

export interface FetchPaywallParams {
  siteId: string
  productId: string
  apiBaseUrl: string
}

/**
 * Paywall API URLを構築
 */
export function buildPaywallUrl(params: FetchPaywallParams): string {
  const searchParams = new URLSearchParams({
    siteId: params.siteId,
    productId: params.productId,
  })
  return `${params.apiBaseUrl}/api/paywall?${searchParams}`
}

/**
 * Paywall情報をAPIから取得
 */
export async function fetchPaywallInfo(params: FetchPaywallParams): Promise<PaywallInfo> {
  const url = buildPaywallUrl(params)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
