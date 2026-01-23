'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchPaywallInfo,
  type PaywallInfo,
  type FetchPaywallParams,
  type SubscriptionPriceOption,
  type SubscriptionOption,
} from './paywall-api'

// Re-export types for consumers
export type {
  PaywallInfo,
  FetchPaywallParams,
  SubscriptionPriceOption,
  SubscriptionOption,
}

export interface UsePaywallParams extends FetchPaywallParams {
  /** フックを有効にするかどうか（デフォルト: true） */
  enabled?: boolean
}

export interface UsePaywallResult {
  paywallInfo: PaywallInfo | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Paywall情報を取得するフック
 *
 * `/api/paywall`エンドポイントから商品情報・価格・セール情報を取得します。
 * 認証不要の公開APIです。
 *
 * @example
 * ```tsx
 * const { paywallInfo, isLoading, error } = usePaywall({
 *   siteId: 'site1',
 *   productId: 'product:course-1',
 *   apiBaseUrl: 'https://api.example.com',
 * })
 * ```
 */
export function usePaywall({
  siteId,
  productId,
  apiBaseUrl,
  enabled = true,
}: UsePaywallParams): UsePaywallResult {
  const [paywallInfo, setPaywallInfo] = useState<PaywallInfo | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)

  const fetchPaywall = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchPaywallInfo({ siteId, productId, apiBaseUrl })
      setPaywallInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setPaywallInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [siteId, productId, apiBaseUrl, enabled])

  useEffect(() => {
    fetchPaywall()
  }, [fetchPaywall])

  return {
    paywallInfo,
    isLoading,
    error,
    refetch: fetchPaywall,
  }
}
