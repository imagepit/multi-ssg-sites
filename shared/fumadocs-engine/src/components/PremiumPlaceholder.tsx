'use client'

import type { ReactNode } from 'react'

export interface PremiumPlaceholderProps {
  /** Section identifier */
  sectionId: string
  /** Product identifier for purchase */
  productId: string
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
  /** Callback when purchase button is clicked */
  onPurchaseClick?: () => void
  /** Custom className for styling */
  className?: string
  /** Render prop for completely custom rendering */
  children?: (props: {
    sectionId: string
    productId: string
    isAuthenticated: boolean
    hasPurchased: boolean
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
export function PremiumPlaceholder({
  sectionId,
  productId,
  title = '有料コンテンツ',
  message,
  purchaseUrl,
  purchaseButtonText = 'コンテンツを購入する',
  isAuthenticated = false,
  hasPurchased = false,
  onPurchaseClick,
  className = '',
  children,
}: PremiumPlaceholderProps) {
  // If render prop is provided, use it
  if (children) {
    return (
      <>
        {children({
          sectionId,
          productId,
          isAuthenticated,
          hasPurchased,
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
