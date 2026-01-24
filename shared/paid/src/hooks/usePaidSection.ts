'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, getAccessToken } from '@techdoc/auth'
import {
  fetchPaywallInfo,
  fetchPaidContent,
  createCheckoutSession,
} from '../lib/api.js'
import type {
  PaywallOptions,
  PaidContentError,
  UsePaidSectionResult,
} from '../lib/types.js'

export interface UsePaidSectionOptions {
  siteId: string
  apiBaseUrl: string
  sectionId: string
  productId: string
  /**
   * パスからslugを抽出する関数
   * デフォルト: /docs/xxx/yyy → xxx/yyy
   */
  extractSlug?: (pathname: string) => string
}

const defaultExtractSlug = (pathname: string): string => {
  return pathname.replace(/^\/docs\//, '').replace(/^\//, '')
}

/**
 * 有料コンテンツセクションの状態管理フック
 */
export function usePaidSection(options: UsePaidSectionOptions): UsePaidSectionResult {
  const {
    siteId,
    apiBaseUrl,
    sectionId,
    productId,
    extractSlug = defaultExtractSlug,
  } = options

  const pathname = usePathname()
  const { user, isLoading: authLoading } = useAuth()

  // アクセストークンを状態として管理
  const [accessToken, setAccessToken] = useState<string | null>(null)
  useEffect(() => {
    setAccessToken(getAccessToken())
  }, [user])

  // パスからslugを生成
  const slug = extractSlug(pathname)

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
      const info = await fetchPaywallInfo(apiBaseUrl, siteId, productId)
      setPaywallInfo(info)
    } catch (err) {
      setPaywallError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setPaywallLoading(false)
    }
  }, [apiBaseUrl, siteId, productId])

  // 有料コンテンツ取得
  const loadContent = useCallback(async () => {
    if (!accessToken) return
    setContentLoading(true)
    setContentError(null)
    try {
      const html = await fetchPaidContent(
        apiBaseUrl,
        { siteId, slug, sectionId, productId },
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
  }, [apiBaseUrl, accessToken, siteId, slug, sectionId, productId])

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
        apiBaseUrl,
        {
          productId,
          stripePriceId,
          mode,
          billingPeriod,
          returnContext: { siteId, slug, sectionId },
        },
        accessToken
      )
      // Stripe Checkoutへリダイレクト
      window.location.href = checkoutUrl
    } catch (err) {
      setCheckoutError(err instanceof Error ? err : new Error('Unknown error'))
      setCheckoutLoading(false)
    }
  }, [apiBaseUrl, accessToken, productId, siteId, slug, sectionId])

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

  return {
    // Paywall情報
    paywallInfo,
    paywallLoading: authLoading || paywallLoading,
    paywallError,
    loadPaywallInfo,

    // 有料コンテンツ
    content,
    contentLoading,
    contentError,
    loadContent,

    // Checkout
    checkoutLoading,
    checkoutError,
    handlePurchase,

    // ユーティリティ
    isAuthenticated: !!user,
    slug,
  }
}
