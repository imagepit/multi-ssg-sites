'use client'

import { useState, useCallback } from 'react'
import {
  createCheckoutSession,
  type CreateCheckoutParams,
  type ReturnContext,
  type CheckoutResponse,
} from './checkout-api'

// Re-export types for consumers
export type { CreateCheckoutParams, ReturnContext, CheckoutResponse }

export interface UseCheckoutParams {
  apiBaseUrl: string
  accessToken: string | null
}

export interface CheckoutSessionParams {
  productId: string
  stripePriceId: string
  mode: 'payment' | 'subscription'
  billingPeriod?: 'monthly' | 'yearly'
  returnContext: ReturnContext
}

export interface UseCheckoutResult {
  createSession: (params: CheckoutSessionParams) => Promise<void>
  isLoading: boolean
  error: Error | null
}

/**
 * Stripe Checkoutセッションを作成するフック
 *
 * `/api/checkout/create`エンドポイントを呼び出し、
 * Checkoutページへリダイレクトします。
 *
 * @example
 * ```tsx
 * const { createSession, isLoading, error } = useCheckout({
 *   apiBaseUrl: 'https://api.example.com',
 *   accessToken: user?.accessToken ?? null,
 * })
 *
 * const handlePurchase = async () => {
 *   await createSession({
 *     productId: 'product:course-1',
 *     stripePriceId: 'price_xxx',
 *     mode: 'payment',
 *     returnContext: {
 *       siteId: 'site1',
 *       slug: 'ai/premium-content',
 *       sectionId: 'section-1',
 *     },
 *   })
 * }
 * ```
 */
export function useCheckout({
  apiBaseUrl,
  accessToken,
}: UseCheckoutParams): UseCheckoutResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createSession = useCallback(
    async (params: CheckoutSessionParams) => {
      if (!accessToken) {
        setError(new Error('ログインが必要です'))
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await createCheckoutSession({
          ...params,
          apiBaseUrl,
          accessToken,
        })

        // Stripe Checkoutページへリダイレクト
        if (typeof window !== 'undefined') {
          window.location.href = response.checkoutUrl
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    },
    [apiBaseUrl, accessToken]
  )

  return {
    createSession,
    isLoading,
    error,
  }
}
