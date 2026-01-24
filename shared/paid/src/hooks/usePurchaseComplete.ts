'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth, getAccessToken } from '@techdoc/auth'
import { checkPaidContentAccess, verifyCheckoutSession } from '../lib/api'
import type {
  PurchaseStatus,
  UsePurchaseCompleteResult,
  PurchaseCompleteParams,
} from '../lib/types'

// ポーリング設定
const POLLING_INTERVAL = 2000 // 2秒
const WEBHOOK_WAIT_TIME = 10000 // Webhook待機時間: 10秒
const FALLBACK_RETRY_COUNT = 3 // フォールバック時のリトライ回数
const FALLBACK_RETRY_INTERVAL = 2000 // フォールバック時のリトライ間隔: 2秒

export interface UsePurchaseCompleteOptions {
  apiBaseUrl: string
  params: PurchaseCompleteParams
}

/**
 * 購入完了ページの状態管理フック
 */
export function usePurchaseComplete(
  options: UsePurchaseCompleteOptions
): UsePurchaseCompleteResult {
  const { apiBaseUrl, params } = options
  const { sessionId, siteId, slug, sectionId, productId } = params

  const { user, isLoading: authLoading } = useAuth()

  // アクセストークンを状態として管理
  const [accessToken, setAccessToken] = useState<string | null>(null)
  useEffect(() => {
    if (!authLoading) {
      setAccessToken(getAccessToken())
    }
  }, [user, authLoading])

  const [status, setStatus] = useState<PurchaseStatus>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // フォールバック処理が実行されたかどうか
  const fallbackExecuted = useRef(false)

  // パラメータが有効かどうか
  const hasValidParams = !!(sessionId && siteId && slug && sectionId && productId)

  // コンテンツページへのURL
  const contentUrl = slug ? `/${slug}${sectionId ? `#${sectionId}` : ''}` : null

  // 購入完了確認（/api/paid-contentポーリング）
  const checkPurchaseStatus = useCallback(async () => {
    if (!accessToken || !siteId || !slug || !sectionId || !productId) {
      return false
    }

    try {
      return await checkPaidContentAccess(
        apiBaseUrl,
        { siteId, slug, sectionId, productId },
        accessToken
      )
    } catch {
      return false
    }
  }, [apiBaseUrl, accessToken, siteId, slug, sectionId, productId])

  // Stripeセッション状態確認（フォールバック）
  const verifyWithStripe = useCallback(async (): Promise<boolean> => {
    if (!accessToken || !sessionId) {
      return false
    }

    // リトライロジック
    for (let i = 0; i < FALLBACK_RETRY_COUNT; i++) {
      try {
        const result = await verifyCheckoutSession(apiBaseUrl, sessionId, accessToken)
        if (result.verified) {
          return true
        }
        if (i < FALLBACK_RETRY_COUNT - 1) {
          await new Promise(resolve => setTimeout(resolve, FALLBACK_RETRY_INTERVAL))
        }
      } catch {
        if (i < FALLBACK_RETRY_COUNT - 1) {
          await new Promise(resolve => setTimeout(resolve, FALLBACK_RETRY_INTERVAL))
        }
      }
    }
    return false
  }, [apiBaseUrl, accessToken, sessionId])

  // ポーリング処理
  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setErrorMessage('セッション情報が見つかりません')
      return
    }

    if (!accessToken) {
      return
    }

    let isMounted = true
    let pollingInterval: ReturnType<typeof setInterval> | null = null
    let webhookTimer: ReturnType<typeof setTimeout> | null = null
    let elapsedTimer: ReturnType<typeof setInterval> | null = null

    const cleanup = () => {
      if (pollingInterval) clearInterval(pollingInterval)
      if (webhookTimer) clearTimeout(webhookTimer)
      if (elapsedTimer) clearInterval(elapsedTimer)
    }

    const startPolling = async () => {
      // 経過時間カウンター
      elapsedTimer = setInterval(() => {
        if (isMounted) {
          setElapsedTime((prev) => prev + 1)
        }
      }, 1000)

      // ポーリング開始
      const poll = async (): Promise<boolean> => {
        const isCompleted = await checkPurchaseStatus()
        if (isMounted && isCompleted) {
          setStatus('completed')
          cleanup()
          return true
        }
        return false
      }

      // 初回チェック
      const initialComplete = await poll()
      if (initialComplete) return

      // 定期ポーリング
      pollingInterval = setInterval(poll, POLLING_INTERVAL)

      // Webhook待機後のフォールバック処理
      webhookTimer = setTimeout(async () => {
        if (!isMounted || fallbackExecuted.current) return
        fallbackExecuted.current = true

        // ポーリングを停止
        if (pollingInterval) {
          clearInterval(pollingInterval)
          pollingInterval = null
        }

        // フォールバック: Stripe APIで直接確認
        if (isMounted) {
          setStatus('verifying')
        }

        const verified = await verifyWithStripe()

        if (!isMounted) return

        if (verified) {
          setStatus('completed')
        } else {
          setStatus('pending')
        }

        if (elapsedTimer) clearInterval(elapsedTimer)
      }, WEBHOOK_WAIT_TIME)
    }

    startPolling()

    return () => {
      isMounted = false
      cleanup()
    }
  }, [sessionId, accessToken, checkPurchaseStatus, verifyWithStripe])

  return {
    status,
    errorMessage,
    elapsedTime,
    contentUrl,
    hasValidParams,
  }
}
