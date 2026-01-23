'use client'

import type { ReactNode } from 'react'

/** Unlock method type */
export type UnlockBy = 'purchase' | 'x_promotion' | 'both'

/** X promotion option for unlock */
export interface XPromotionOption {
  /** Campaign ID */
  campaignId: string
  /** Tweet ID to repost */
  tweetId: string
  /** Tweet URL to link/repost */
  tweetUrl: string
  /** Display label (e.g., "拡散で応援して無料で読む") */
  label: string
  /** Campaign end time (ISO 8601 or unix seconds) */
  endsAt?: string | number | null
}

/** X connection status */
export interface XConnectionStatus {
  /** Whether the user is connected to X */
  isConnected: boolean
  /** X username if connected */
  xUsername?: string
  /** X profile image if connected */
  xProfileImage?: string
}

/** Sale information for display */
export interface SaleInfo {
  /** Sale price */
  price: number
  /** Original price before discount */
  originalPrice: number
  /** Sale label (e.g., "セール中", "初月限定") */
  label: string
  /** Sale end time (ISO 8601) */
  endsAt: string
  /** Stripe Coupon ID for subscription discounts */
  stripeCouponId?: string
}

/** Subscription price option */
export interface SubscriptionPriceOption {
  billingPeriod: 'monthly' | 'yearly'
  price: number
  stripePriceId: string
  label?: string
  badge?: string
  /** Active sale information */
  sale?: SaleInfo
}

/** Single purchase option */
export interface SinglePurchaseOption {
  productId: string
  price: number
  description?: string
  stripePriceId: string
  /** Active sale information */
  sale?: SaleInfo
}

/** Subscription option with multiple prices */
export interface SubscriptionOption {
  productId: string
  name: string
  description?: string
  prices: SubscriptionPriceOption[]
}

/** Purchase options containing single and/or subscription */
export interface PurchaseOptions {
  singlePurchase?: SinglePurchaseOption
  subscription?: SubscriptionOption
}

export interface PremiumPlaceholderProps {
  /** Section identifier */
  sectionId: string
  /** Product identifier for purchase */
  productId: string
  /** Unlock method: 'purchase', 'x_promotion', or 'both' (default: 'purchase') */
  unlockBy?: UnlockBy
  /** Custom title for the placeholder (defaults to "有料コンテンツ") */
  title?: string
  /** Custom message shown in the placeholder */
  message?: ReactNode
  /** URL or path to purchase page */
  purchaseUrl?: string
  /** Text for the purchase button */
  purchaseButtonText?: string
  /** Whether the user is authenticated */
  isAuthenticated?: boolean
  /** Whether the user has purchased this product */
  hasPurchased?: boolean
  /** Whether the user has unlocked via X promotion */
  hasUnlockedViaXPromotion?: boolean
  /** X promotion option (required when unlockBy includes x_promotion) */
  xPromotionOption?: XPromotionOption
  /** X connection status */
  xConnectionStatus?: XConnectionStatus
  /** Callback when purchase button is clicked */
  onPurchaseClick?: () => void
  /** Custom className for styling */
  className?: string
  /** Purchase options for paywall UI (single + subscription) */
  purchaseOptions?: PurchaseOptions
  /** Callback when single purchase button is clicked */
  onSinglePurchaseClick?: (productId: string, stripePriceId: string) => void
  /** Callback when subscription button is clicked */
  onSubscriptionClick?: (productId: string, stripePriceId: string, billingPeriod: 'monthly' | 'yearly') => void
  /** Callback when X connect button is clicked */
  onXConnectClick?: () => void
  /** Callback when verify repost button is clicked */
  onVerifyRepostClick?: (campaignId: string) => void
  /** Loading state for X verification */
  isVerifyingRepost?: boolean
  /** Error message for X verification */
  xVerificationError?: string
  /** Render prop for completely custom rendering */
  children?: (props: {
    sectionId: string
    productId: string
    unlockBy: UnlockBy
    isAuthenticated: boolean
    hasPurchased: boolean
    hasUnlockedViaXPromotion: boolean
  }) => ReactNode
}

/**
 * Premium content placeholder component
 *
 * This component is rendered in place of paid content sections.
 * It shows a placeholder UI indicating that premium content is available.
 *
 * @example
 * ```tsx
 * // Basic usage (in mdx-components.tsx)
 * import { PremiumPlaceholder } from '@techdoc/fumadocs-engine/components'
 *
 * export function useMDXComponents(components: MDXComponents): MDXComponents {
 *   return {
 *     ...components,
 *     PremiumPlaceholder,
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom rendering with render prop
 * <PremiumPlaceholder
 *   sectionId="intro"
 *   productId="product:course-1"
 * >
 *   {({ productId, hasPurchased }) => (
 *     hasPurchased ? <LoadPaidContent /> : <CustomPurchaseUI />
 *   )}
 * </PremiumPlaceholder>
 * ```
 */
/** Format price in JPY */
function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`
}

/** Format campaign end date for display */
function formatCampaignEndDate(endsAt: string | number): string {
  const date = typeof endsAt === 'number'
    ? new Date(endsAt * 1000) // Unix seconds
    : new Date(endsAt)        // ISO 8601
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}

/** X (Twitter) icon component */
function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Loading spinner component */
function LoadingSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/** Format sale end date for display */
function formatSaleEndDate(isoString: string): string {
  const date = new Date(isoString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}

/** Sale badge component */
function SaleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
      {label}
    </span>
  )
}

/** Sale price display component */
function SalePriceDisplay({ sale, billingPeriod }: { sale: SaleInfo; billingPeriod?: 'monthly' | 'yearly' }) {
  const periodSuffix = billingPeriod ? `/${billingPeriod === 'monthly' ? '月' : '年'}` : ''
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <SaleBadge label={sale.label} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-fd-muted-foreground line-through">
          {formatPrice(sale.originalPrice)}{periodSuffix}
        </span>
        <span className="text-2xl font-bold text-red-500">
          {formatPrice(sale.price)}{periodSuffix}
        </span>
      </div>
      <p className="text-xs text-fd-muted-foreground">
        〜 {formatSaleEndDate(sale.endsAt)} まで
      </p>
    </div>
  )
}

export function PremiumPlaceholder({
  sectionId,
  productId,
  unlockBy = 'purchase',
  title = '有料コンテンツ',
  message,
  purchaseUrl,
  purchaseButtonText = 'コンテンツを購入する',
  isAuthenticated = false,
  hasPurchased = false,
  hasUnlockedViaXPromotion = false,
  xPromotionOption,
  xConnectionStatus,
  onPurchaseClick,
  className = '',
  purchaseOptions,
  onSinglePurchaseClick,
  onSubscriptionClick,
  onXConnectClick,
  onVerifyRepostClick,
  isVerifyingRepost = false,
  xVerificationError,
  children,
}: PremiumPlaceholderProps) {
  // If render prop is provided, use it
  if (children) {
    return (
      <>
        {children({
          sectionId,
          productId,
          unlockBy,
          isAuthenticated,
          hasPurchased,
          hasUnlockedViaXPromotion,
        })}
      </>
    )
  }

  const defaultMessage = isAuthenticated
    ? 'このセクションは有料コンテンツです。購入するとアクセスできるようになります。'
    : 'このセクションは有料コンテンツです。ログインして購入状況を確認するか、新規購入してください。'

  const handleClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick()
    } else if (purchaseUrl) {
      window.location.href = purchaseUrl
    }
  }

  const handleSinglePurchase = () => {
    if (purchaseOptions?.singlePurchase && onSinglePurchaseClick) {
      onSinglePurchaseClick(
        purchaseOptions.singlePurchase.productId,
        purchaseOptions.singlePurchase.stripePriceId
      )
    }
  }

  const handleSubscription = (price: SubscriptionPriceOption) => {
    if (purchaseOptions?.subscription && onSubscriptionClick) {
      onSubscriptionClick(
        purchaseOptions.subscription.productId,
        price.stripePriceId,
        price.billingPeriod
      )
    }
  }

  const handleXConnect = () => {
    if (onXConnectClick) {
      onXConnectClick()
    }
  }

  const handleVerifyRepost = () => {
    if (xPromotionOption && onVerifyRepostClick) {
      onVerifyRepostClick(xPromotionOption.campaignId)
    }
  }

  // Check if X promotion should be shown
  const showXPromotion = (unlockBy === 'x_promotion' || unlockBy === 'both') && xPromotionOption
  const showPurchase = unlockBy === 'purchase' || unlockBy === 'both'

  // If purchaseOptions is provided or X promotion is available, render the paywall UI (note-like style)
  if (purchaseOptions || showXPromotion) {
    const { singlePurchase, subscription } = purchaseOptions ?? {}

    // Calculate grid columns based on available options
    const optionCount = [
      showPurchase && singlePurchase,
      showPurchase && subscription,
      showXPromotion
    ].filter(Boolean).length

    const gridColsClass = optionCount === 1
      ? 'md:grid-cols-1 max-w-md mx-auto'
      : optionCount === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-3'

    return (
      <div
        className={`premium-placeholder rounded-lg border-2 border-dashed border-fd-primary/30 bg-fd-primary/5 p-6 my-4 ${className}`}
        data-section-id={sectionId}
        data-product-id={productId}
        data-unlock-by={unlockBy}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fd-primary/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-fd-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
              {title}
            </h3>
            <p className="text-fd-muted-foreground text-sm">
              {message || defaultMessage}
            </p>
          </div>
        </div>

        {/* Purchase Options Grid */}
        <div className={`grid gap-4 ${gridColsClass}`}>
          {/* X Promotion Option */}
          {showXPromotion && xPromotionOption && (
            <div className="rounded-lg border-2 border-sky-500 bg-fd-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <XIcon className="w-5 h-5" />
                <h4 className="font-semibold text-fd-foreground">
                  {xPromotionOption.label}
                </h4>
              </div>
              <p className="text-xs text-fd-muted-foreground mb-3">
                以下のポストをリポストすると、このコンテンツを無料で読めるようになります。
              </p>

              {/* Campaign end date if set */}
              {xPromotionOption.endsAt && (
                <p className="text-xs text-fd-muted-foreground mb-3">
                  キャンペーン期限: {formatCampaignEndDate(xPromotionOption.endsAt)}
                </p>
              )}

              {/* X Connection Status */}
              {!xConnectionStatus?.isConnected ? (
                <button
                  type="button"
                  onClick={handleXConnect}
                  className="w-full rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  X（Twitter）と連携する
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Connected user info */}
                  <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                    {xConnectionStatus.xProfileImage && (
                      <img
                        src={xConnectionStatus.xProfileImage}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>@{xConnectionStatus.xUsername} で連携中</span>
                  </div>

                  {/* Repost link */}
                  <a
                    href={xPromotionOption.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-lg border border-sky-500 text-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-50 dark:hover:bg-sky-950 transition flex items-center justify-center gap-2"
                  >
                    <XIcon className="w-4 h-4" />
                    ポストを見てリポストする
                  </a>

                  {/* Verify repost button */}
                  <button
                    type="button"
                    onClick={handleVerifyRepost}
                    disabled={isVerifyingRepost}
                    className="w-full rounded-lg bg-sky-500 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifyingRepost ? (
                      <>
                        <LoadingSpinner className="w-4 h-4" />
                        確認中...
                      </>
                    ) : (
                      <>
                        リポストを確認する
                      </>
                    )}
                  </button>

                  {/* Error message */}
                  {xVerificationError && (
                    <p className="text-xs text-red-500">
                      {xVerificationError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Single Purchase Option */}
          {showPurchase && singlePurchase && (
            <div className={`rounded-lg border ${singlePurchase.sale ? 'border-red-500 border-2' : 'border-fd-border'} bg-fd-card p-4`}>
              <h4 className="font-semibold text-fd-foreground mb-1">
                この記事のみ
              </h4>
              {singlePurchase.description && (
                <p className="text-xs text-fd-muted-foreground mb-3">
                  {singlePurchase.description}
                </p>
              )}
              <div className="mb-3">
                {singlePurchase.sale ? (
                  <SalePriceDisplay sale={singlePurchase.sale} />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fd-foreground">
                      {formatPrice(singlePurchase.price)}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSinglePurchase}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  singlePurchase.sale
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-fd-primary text-fd-primary-foreground hover:opacity-90'
                }`}
              >
                購入する
              </button>
            </div>
          )}

          {/* Subscription Option */}
          {showPurchase && subscription && subscription.prices.length > 0 && (
            <div className="rounded-lg border-2 border-fd-primary bg-fd-card p-4">
              <h4 className="font-semibold text-fd-foreground mb-1">
                {subscription.name}
              </h4>
              {subscription.description && (
                <p className="text-xs text-fd-muted-foreground mb-3">
                  {subscription.description}
                </p>
              )}
              <div className="space-y-2">
                {subscription.prices.map((price) => (
                  <button
                    key={price.billingPeriod}
                    type="button"
                    onClick={() => handleSubscription(price)}
                    className={`w-full rounded-lg border bg-fd-background px-4 py-3 text-sm hover:bg-fd-accent transition ${
                      price.sale ? 'border-red-500 border-2' : 'border-fd-border'
                    }`}
                  >
                    {price.sale ? (
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <SaleBadge label={price.sale.label} />
                          {price.badge && (
                            <span className="inline-flex items-center rounded-full bg-fd-primary/10 px-2 py-0.5 text-xs font-medium text-fd-primary">
                              {price.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-fd-muted-foreground line-through">
                            {formatPrice(price.sale.originalPrice)}/{price.billingPeriod === 'monthly' ? '月' : '年'}
                          </span>
                          <span className="text-lg font-bold text-red-500">
                            {formatPrice(price.sale.price)}/{price.billingPeriod === 'monthly' ? '月' : '年'}
                          </span>
                        </div>
                        <p className="text-xs text-fd-muted-foreground mt-1">
                          〜 {formatSaleEndDate(price.sale.endsAt)} まで
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-fd-foreground">
                            {formatPrice(price.price)}
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
                          {price.label || (price.billingPeriod === 'monthly' ? '月額プラン' : '年額プラン')}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default simple UI
  return (
    <div
      className={`premium-placeholder rounded-lg border-2 border-dashed border-fd-primary/30 bg-fd-primary/5 p-6 my-4 ${className}`}
      data-section-id={sectionId}
      data-product-id={productId}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fd-primary/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-fd-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-fd-foreground mb-2">
            {title}
          </h3>
          <p className="text-fd-muted-foreground text-sm mb-4">
            {message || defaultMessage}
          </p>
          {(purchaseUrl || onPurchaseClick) && (
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
            >
              {purchaseButtonText}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
        </div>
      </div>
    </div>
  )
}
