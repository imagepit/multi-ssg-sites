'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, getAccessToken } from '@techdoc/auth'
import { PaidSkeleton } from './PaidSkeleton'

// 環境変数から取得
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || ''
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 型定義（APIレスポンス形式に合わせた定義）
interface SaleInfo {
  price: number
  originalPrice: number
  label: string
  startsAt: string
  endsAt: string
  stripeCouponId?: string
}

interface SinglePurchaseOption {
  productId: string
  price: number
  description?: string
  stripePriceId: string
  sale?: SaleInfo
}

interface SubscriptionPriceOption {
  billingPeriod: 'monthly' | 'yearly'
  price: number
  stripePriceId: string
  label?: string
  badge?: string
  sale?: SaleInfo
}

interface SubscriptionOption {
  productId: string
  name: string
  description?: string
  prices: SubscriptionPriceOption[]
}

// APIレスポンス形式
interface PaywallOptions {
  singlePurchase?: SinglePurchaseOption
  subscription?: SubscriptionOption
}

interface PaidContentError {
  type: 'unauthorized' | 'forbidden' | 'not_found' | 'network'
  message: string
}

export interface PaidSectionProps {
  sectionId: string
  productId: string
}

/**
 * Paywall情報を取得
 */
async function fetchPaywallInfo(siteId: string, productId: string): Promise<PaywallOptions> {
  const params = new URLSearchParams({ siteId, productId })
  const response = await fetch(`${API_BASE_URL}/api/paywall?${params}`, {
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
async function fetchPaidContent(
  params: { siteId: string; slug: string; sectionId: string; productId: string },
  accessToken: string
): Promise<string> {
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${API_BASE_URL}/api/paid-content?${searchParams}`, {
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

  const { signedUrl } = await response.json()
  const contentResponse = await fetch(signedUrl)
  if (!contentResponse.ok) {
    throw { type: 'network', message: 'コンテンツの取得に失敗しました' } as PaidContentError
  }
  const { html } = await contentResponse.json()
  return html
}

/**
 * Checkoutセッションを作成
 */
async function createCheckoutSession(
  params: {
    productId: string
    stripePriceId: string
    mode: 'payment' | 'subscription'
    billingPeriod?: 'monthly' | 'yearly'
    returnContext: { siteId: string; slug: string; sectionId: string }
  },
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

  const response = await fetch(`${API_BASE_URL}/api/checkout/create`, {
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
 * 有料コンテンツセクションコンポーネント
 *
 * PremiumPlaceholderの代わりに使用し、以下の状態を管理:
 * - Paywall読み込み中: Skeleton UI
 * - 未ログイン: ログインボタン付きPaywall
 * - ログイン済み・未購入: 購入ボタン付きPaywall
 * - コンテンツ読み込み中: Skeleton UI
 * - 購入済み: 有料コンテンツ本文
 * - エラー: エラーメッセージ + リトライボタン
 */
export function PaidSection({ sectionId, productId }: PaidSectionProps) {
  const pathname = usePathname()
  const { user, isLoading: authLoading } = useAuth()

  // アクセストークンを状態として管理
  const [accessToken, setAccessToken] = useState<string | null>(null)
  useEffect(() => {
    setAccessToken(getAccessToken())
  }, [user])

  // パスからslugを生成（/docs/ai/premium-content → ai/premium-content）
  const slug = pathname.replace(/^\/docs\//, '').replace(/^\//, '')

  // Paywall情報の状態
  const [paywallInfo, setPaywallInfo] = useState<PaywallOptions | null>(null)
  const [paywallLoading, setPaywallLoading] = useState(true)
  const [paywallError, setPaywallError] = useState<Error | null>(null)

  // 有料コンテンツの状態
  const [content, setContent] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [contentError, setContentError] = useState<PaidContentError | null>(null)

  // Checkoutの状態
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<Error | null>(null)

  // Paywall情報取得
  const loadPaywallInfo = useCallback(async () => {
    setPaywallLoading(true)
    setPaywallError(null)
    try {
      const info = await fetchPaywallInfo(SITE_ID, productId)
      setPaywallInfo(info)
    } catch (err) {
      setPaywallError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setPaywallLoading(false)
    }
  }, [productId])

  // 有料コンテンツ取得
  const loadContent = useCallback(async () => {
    if (!accessToken) return
    setContentLoading(true)
    setContentError(null)
    try {
      const html = await fetchPaidContent(
        { siteId: SITE_ID, slug, sectionId, productId },
        accessToken
      )
      setContent(html)
    } catch (err) {
      const paidError = err as PaidContentError
      if (paidError.type) {
        setContentError(paidError)
      } else {
        setContentError({ type: 'network', message: String(err) })
      }
    } finally {
      setContentLoading(false)
    }
  }, [accessToken, slug, sectionId, productId])

  // Checkoutセッション作成
  const handlePurchase = useCallback(async (
    stripePriceId: string,
    mode: 'payment' | 'subscription',
    billingPeriod?: 'monthly' | 'yearly'
  ) => {
    if (!accessToken) return
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const checkoutUrl = await createCheckoutSession(
        {
          productId,
          stripePriceId,
          mode,
          billingPeriod,
          returnContext: { siteId: SITE_ID, slug, sectionId },
        },
        accessToken
      )
      // Stripe Checkoutへリダイレクト
      window.location.href = checkoutUrl
    } catch (err) {
      setCheckoutError(err instanceof Error ? err : new Error('Unknown error'))
      setCheckoutLoading(false)
    }
  }, [accessToken, productId, slug, sectionId])

  // 初回読み込み
  useEffect(() => {
    loadPaywallInfo()
  }, [loadPaywallInfo])

  // ログイン状態が変わったらコンテンツ取得
  useEffect(() => {
    if (accessToken) {
      loadContent()
    }
  }, [accessToken, loadContent])

  // ローディング状態
  if (authLoading || paywallLoading) {
    return <PaidSkeleton />
  }

  // Paywallエラー
  if (paywallError) {
    return (
      <ErrorDisplay
        message="商品情報の取得に失敗しました"
        onRetry={loadPaywallInfo}
      />
    )
  }

  // 購入済み（コンテンツ取得成功）
  if (content) {
    return (
      <div
        className="paid-content my-4"
        data-section-id={sectionId}
        data-product-id={productId}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // コンテンツ読み込み中（ログイン済み・購入済みの可能性あり）
  if (accessToken && contentLoading) {
    return <PaidSkeleton />
  }

  // コンテンツエラー（未購入以外）
  if (contentError && contentError.type === 'network') {
    return (
      <ErrorDisplay
        message={contentError.message}
        onRetry={loadContent}
      />
    )
  }

  // 未ログインまたは未購入 → Paywall表示
  return (
    <PaywallDisplay
      sectionId={sectionId}
      productId={productId}
      paywallInfo={paywallInfo}
      isAuthenticated={!!user}
      onLogin={handleLogin}
      onPurchase={handlePurchase}
      isCheckoutLoading={checkoutLoading}
      checkoutError={checkoutError}
    />
  )
}

/**
 * ログインページへ遷移
 */
function handleLogin() {
  if (typeof window !== 'undefined') {
    // 現在のURLを保存してログインページへ
    const returnUrl = window.location.href
    window.location.href = `/login?next=${encodeURIComponent(returnUrl)}`
  }
}

/**
 * エラー表示コンポーネント
 */
function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="rounded-lg border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20 p-6 my-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
            エラーが発生しました
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
      >
        再試行
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  )
}

/**
 * Paywall表示コンポーネント
 */
function PaywallDisplay({
  sectionId,
  productId,
  paywallInfo,
  isAuthenticated,
  onLogin,
  onPurchase,
  isCheckoutLoading,
  checkoutError,
}: {
  sectionId: string
  productId: string
  paywallInfo: PaywallOptions | null
  isAuthenticated: boolean
  onLogin: () => void
  onPurchase: (
    stripePriceId: string,
    mode: 'payment' | 'subscription',
    billingPeriod?: 'monthly' | 'yearly'
  ) => void
  isCheckoutLoading: boolean
  checkoutError: Error | null
}) {
  const defaultMessage = isAuthenticated
    ? 'このセクションは有料コンテンツです。購入するとアクセスできるようになります。'
    : 'このセクションは有料コンテンツです。ログインして購入状況を確認するか、新規購入してください。'

  const singlePurchase = paywallInfo?.singlePurchase
  const subscription = paywallInfo?.subscription

  return (
    <div
      className="premium-placeholder rounded-lg border-2 border-dashed border-fd-primary/30 bg-fd-primary/5 p-6 my-4"
      data-section-id={sectionId}
      data-product-id={productId}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fd-primary/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-fd-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-fd-foreground">
            {subscription?.name || '有料コンテンツ'}
          </h3>
          <p className="text-fd-muted-foreground text-sm">{defaultMessage}</p>
        </div>
      </div>

      {/* チェックアウトエラー */}
      {checkoutError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            {checkoutError.message}
          </p>
        </div>
      )}

      {/* 未ログイン: ログインボタン */}
      {!isAuthenticated && (
        <button
          type="button"
          onClick={onLogin}
          className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
        >
          ログインして確認
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* ログイン済み: 購入オプション */}
      {isAuthenticated && paywallInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* 単体購入 */}
          {singlePurchase && (
            <div
              className={`rounded-lg border ${
                singlePurchase.sale ? 'border-red-500 border-2' : 'border-fd-border'
              } bg-fd-card p-4`}
            >
              <h4 className="font-semibold text-fd-foreground mb-1">この記事のみ</h4>
              {singlePurchase.description && (
                <p className="text-xs text-fd-muted-foreground mb-3">
                  {singlePurchase.description}
                </p>
              )}
              <div className="mb-3">
                {singlePurchase.sale ? (
                  <SalePriceDisplay
                    originalPrice={singlePurchase.sale.originalPrice}
                    salePrice={singlePurchase.sale.price}
                    saleLabel={singlePurchase.sale.label}
                    saleEndsAt={singlePurchase.sale.endsAt}
                  />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fd-foreground">
                      ¥{singlePurchase.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onPurchase(singlePurchase.stripePriceId, 'payment')}
                disabled={isCheckoutLoading}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  singlePurchase.sale
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-fd-primary text-fd-primary-foreground hover:opacity-90'
                } disabled:opacity-50`}
              >
                {isCheckoutLoading ? '処理中...' : '購入する'}
              </button>
            </div>
          )}

          {/* サブスクリプション */}
          {subscription && (
            <div
              className="rounded-lg border-2 border-fd-primary bg-fd-card p-4"
            >
              <h4 className="font-semibold text-fd-foreground mb-1">
                {subscription.name}
              </h4>
              {subscription.description && (
                <p className="text-xs text-fd-muted-foreground mb-3">
                  {subscription.description}
                </p>
              )}
              <div className="space-y-2">
                {subscription.prices.map((price: SubscriptionPriceOption) => (
                  <button
                    key={price.billingPeriod}
                    type="button"
                    onClick={() =>
                      onPurchase(price.stripePriceId, 'subscription', price.billingPeriod)
                    }
                    disabled={isCheckoutLoading}
                    className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-sm hover:bg-fd-accent transition disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-fd-foreground">
                          ¥{price.price.toLocaleString()}
                          <span className="font-normal text-fd-muted-foreground">
                            /{price.billingPeriod === 'monthly' ? '月' : '年'}
                          </span>
                        </span>
                        {price.badge && (
                          <span className="inline-flex items-center rounded-full bg-fd-primary/10 px-2 py-0.5 text-xs font-medium text-fd-primary">
                            {price.badge}
                          </span>
                        )}
                      </span>
                      <span className="text-fd-muted-foreground">
                        {price.label ||
                          (price.billingPeriod === 'monthly' ? '月額プラン' : '年額プラン')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * セール価格表示コンポーネント
 */
function SalePriceDisplay({
  originalPrice,
  salePrice,
  saleLabel,
  saleEndsAt,
}: {
  originalPrice: number
  salePrice: number
  saleLabel?: string
  saleEndsAt?: string  // ISO 8601形式
}) {
  const formatEndDate = (isoString: string) => {
    const date = new Date(isoString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}月${day}日 ${hours}:${minutes}`
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
          {saleLabel || 'セール中'}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-fd-muted-foreground line-through">
          ¥{originalPrice.toLocaleString()}
        </span>
        <span className="text-2xl font-bold text-red-500">
          ¥{salePrice.toLocaleString()}
        </span>
      </div>
      {saleEndsAt && (
        <p className="text-xs text-fd-muted-foreground">
          〜 {formatEndDate(saleEndsAt)} まで
        </p>
      )}
    </div>
  )
}
