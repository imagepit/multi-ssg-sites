'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchPaidContent,
  isPaidContentError,
  type PaidContentError,
  type FetchPaidContentParams,
} from './paid-content-api'

// Re-export types for consumers
export type { PaidContentError, FetchPaidContentParams }
export { isPaidContentError }

export interface UsePaidContentParams {
  siteId: string
  slug: string
  sectionId: string
  productId: string
  apiBaseUrl: string
  /** アクセストークン（nullの場合は即座にunauthorizedエラー） */
  accessToken: string | null
  /** フックを有効にするかどうか（デフォルト: true） */
  enabled?: boolean
}

export interface UsePaidContentResult {
  content: string | null
  isLoading: boolean
  error: PaidContentError | null
  refetch: () => Promise<void>
}

/**
 * 有料コンテンツを取得するフック
 *
 * `/api/paid-content`エンドポイントから署名URLを取得し、
 * R2からHTMLコンテンツを取得します。
 *
 * @example
 * ```tsx
 * const { content, isLoading, error } = usePaidContent({
 *   siteId: 'site1',
 *   slug: 'ai/premium-content',
 *   sectionId: 'section-1',
 *   productId: 'product:course-1',
 *   apiBaseUrl: 'https://api.example.com',
 *   accessToken: user?.accessToken ?? null,
 * })
 *
 * if (error?.type === 'forbidden') {
 *   return <Paywall />
 * }
 *
 * if (content) {
 *   return <div dangerouslySetInnerHTML={{ __html: content }} />
 * }
 * ```
 */
export function usePaidContent({
  siteId,
  slug,
  sectionId,
  productId,
  apiBaseUrl,
  accessToken,
  enabled = true,
}: UsePaidContentParams): UsePaidContentResult {
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(enabled && accessToken !== null)
  const [error, setError] = useState<PaidContentError | null>(null)

  const fetchContent = useCallback(async () => {
    // accessTokenがない場合は即座にunauthorizedエラー
    if (!accessToken) {
      setError({ type: 'unauthorized', message: 'ログインが必要です' })
      setIsLoading(false)
      return
    }

    if (!enabled) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const html = await fetchPaidContent({
        siteId,
        slug,
        sectionId,
        productId,
        apiBaseUrl,
        accessToken,
      })
      setContent(html)
      setError(null)
    } catch (err) {
      if (isPaidContentError(err)) {
        setError(err)
      } else {
        setError({
          type: 'network',
          message: err instanceof Error ? err.message : 'Unknown error',
        })
      }
      setContent(null)
    } finally {
      setIsLoading(false)
    }
  }, [siteId, slug, sectionId, productId, apiBaseUrl, accessToken, enabled])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return {
    content,
    isLoading,
    error,
    refetch: fetchContent,
  }
}
