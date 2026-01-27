'use client'

import {
  usePaidSection,
  type PaywallOptions,
  type SubscriptionPriceOption,
} from '@techdoc/paid'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { createRoot, type Root } from 'react-dom/client'
import { PaidSkeleton } from './PaidSkeleton'
import { useEffect, useRef } from 'react'

// 環境変数から取得
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || ''
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export interface PaidSectionProps {
  sectionId: string
  productId: string
}

/**
 * 有料コンテンツセクションコンポーネント
 *
 * 以下の状態を管理:
 * - Paywall読み込み中: Skeleton UI
 * - 未ログイン: ログインボタン付きPaywall
 * - ログイン済み・未購入: 購入ボタン付きPaywall
 * - コンテンツ読み込み中: Skeleton UI
 * - 購入済み: 有料コンテンツ本文
 * - エラー: エラーメッセージ + リトライボタン
 */
export function PaidSection({ sectionId, productId }: PaidSectionProps) {
  const {
    paywallInfo,
    paywallLoading,
    paywallError,
    loadPaywallInfo,
    content,
    contentLoading,
    contentError,
    loadContent,
    checkoutLoading,
    checkoutError,
    handlePurchase,
    isAuthenticated,
  } = usePaidSection({
    siteId: SITE_ID,
    apiBaseUrl: API_BASE_URL,
    sectionId,
    productId,
  })

  const contentContainerRef = useRef<HTMLDivElement | null>(null)
  const codeBlockRootsRef = useRef<Root[]>([])

  useEffect(() => {
    // Unmount previous mounted code blocks (when content changes)
    for (const root of codeBlockRootsRef.current) root.unmount()
    codeBlockRootsRef.current = []

    const container = contentContainerRef.current
    if (!container) return

    const preNodes = Array.from(container.querySelectorAll('pre.shiki')) as HTMLPreElement[]
    for (const pre of preNodes) {
      // Skip already enhanced blocks (in case of re-run)
      if (pre.closest('[data-paid-codeblock-root]')) continue

      const mountPoint = document.createElement('div')
      mountPoint.dataset.paidCodeblockRoot = 'true'

      const preHtml = pre.innerHTML
      const props = htmlAttributesToCodeBlockProps(pre)

      pre.replaceWith(mountPoint)

      const root = createRoot(mountPoint)
      root.render(
        <CodeBlock {...props}>
          <Pre dangerouslySetInnerHTML={{ __html: preHtml }} />
        </CodeBlock>
      )
      codeBlockRootsRef.current.push(root)
    }

    return () => {
      for (const root of codeBlockRootsRef.current) root.unmount()
      codeBlockRootsRef.current = []
    }
  }, [content])

  // ローディング状態
  if (paywallLoading) {
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
        ref={contentContainerRef}
      />
    )
  }

  // コンテンツ読み込み中（ログイン済み・購入済みの可能性あり）
  if (isAuthenticated && contentLoading) {
    return <PaidSkeleton />
  }

  // コンテンツエラー（ネットワークエラーまたはコンテンツ未配置）
  // forbidden以外のエラーはエラー表示（購入済みユーザーにPaywallを見せないため）
  if (contentError && (contentError.type === 'network' || contentError.type === 'not_found')) {
    return (
      <ErrorDisplay
        message={contentError.type === 'not_found'
          ? 'コンテンツが見つかりません。しばらく経ってから再度お試しください。'
          : contentError.message}
        onRetry={loadContent}
      />
    )
  }

  // 未ログイン、未購入、またはアクセス拒否 → Paywall表示
  return (
    <PaywallDisplay
      sectionId={sectionId}
      productId={productId}
      paywallInfo={paywallInfo}
      isAuthenticated={isAuthenticated}
      onLogin={handleLogin}
      onPurchase={handlePurchase}
      isCheckoutLoading={checkoutLoading}
      checkoutError={checkoutError}
    />
  )
}

function htmlAttributesToCodeBlockProps(pre: HTMLPreElement): Record<string, any> {
  const props: Record<string, any> = {}

  for (const attr of Array.from(pre.attributes)) {
    const name = attr.name
    const value = attr.value

    if (name === 'class') {
      props.className = value
      continue
    }
    if (name === 'style') {
      props.style = parseInlineStyle(value)
      continue
    }
    if (name === 'icon') {
      props.icon = value
      continue
    }
    if (name === 'title') {
      props.title = value
      continue
    }
    if (name.startsWith('data-')) {
      props[name] = value === '' ? true : value
      continue
    }

    // Pass-through for other attributes (rare)
    props[name] = value
  }

  return props
}

function parseInlineStyle(styleText: string): Record<string, string> {
  const style: Record<string, string> = {}
  for (const part of styleText.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    const prop = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!prop) continue
    style[prop] = value
  }
  return style
}

/**
 * ログインページへ遷移
 */
function handleLogin() {
  if (typeof window !== 'undefined') {
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
  saleEndsAt?: string
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
