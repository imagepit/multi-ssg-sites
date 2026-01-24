/**
 * 有料コンテンツ関連の型定義
 */

// セール情報
export interface SaleInfo {
  price: number
  originalPrice: number
  label: string
  startsAt: string
  endsAt: string
  stripeCouponId?: string
}

// 単体購入オプション
export interface SinglePurchaseOption {
  productId: string
  price: number
  description?: string
  stripePriceId: string
  sale?: SaleInfo
}

// サブスクリプション価格オプション
export interface SubscriptionPriceOption {
  billingPeriod: 'monthly' | 'yearly'
  price: number
  stripePriceId: string
  label?: string
  badge?: string
  sale?: SaleInfo
}

// サブスクリプションオプション
export interface SubscriptionOption {
  productId: string
  name: string
  description?: string
  prices: SubscriptionPriceOption[]
}

// Paywall APIレスポンス
export interface PaywallOptions {
  singlePurchase?: SinglePurchaseOption
  subscription?: SubscriptionOption
}

// 有料コンテンツ取得エラー
export interface PaidContentError {
  type: 'unauthorized' | 'forbidden' | 'not_found' | 'network'
  message: string
}

// PaidSection コンポーネントのProps
export interface PaidSectionProps {
  sectionId: string
  productId: string
}

// 購入完了ページのステータス
export type PurchaseStatus = 'checking' | 'verifying' | 'completed' | 'pending' | 'error'

// 購入コンテキスト（Stripe Checkoutに渡すリターン情報）
export interface PurchaseReturnContext {
  siteId: string
  slug: string
  sectionId: string
}

// Checkoutセッション作成パラメータ
export interface CreateCheckoutParams {
  productId: string
  stripePriceId: string
  mode: 'payment' | 'subscription'
  billingPeriod?: 'monthly' | 'yearly'
  returnContext: PurchaseReturnContext
}

// 有料コンテンツ取得パラメータ
export interface FetchPaidContentParams {
  siteId: string
  slug: string
  sectionId: string
  productId: string
}

// usePaidSection フックの戻り値
export interface UsePaidSectionResult {
  // Paywall情報
  paywallInfo: PaywallOptions | null
  paywallLoading: boolean
  paywallError: Error | null
  loadPaywallInfo: () => Promise<void>

  // 有料コンテンツ
  content: string | null
  contentLoading: boolean
  contentError: PaidContentError | null
  loadContent: () => Promise<void>

  // Checkout
  checkoutLoading: boolean
  checkoutError: Error | null
  handlePurchase: (
    stripePriceId: string,
    mode: 'payment' | 'subscription',
    billingPeriod?: 'monthly' | 'yearly'
  ) => Promise<void>

  // ユーティリティ
  isAuthenticated: boolean
  slug: string
}

// usePurchaseComplete フックの戻り値
export interface UsePurchaseCompleteResult {
  status: PurchaseStatus
  errorMessage: string | null
  elapsedTime: number
  contentUrl: string | null
  hasValidParams: boolean
}

// 購入完了ページのURLパラメータ
export interface PurchaseCompleteParams {
  sessionId: string | null
  siteId: string | null
  slug: string | null
  sectionId: string | null
  productId: string | null
}
