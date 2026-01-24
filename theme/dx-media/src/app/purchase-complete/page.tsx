'use client'

import { useEffect, useState, useCallback, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth, getAccessToken } from '@techdoc/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// ポーリング設定
const POLLING_INTERVAL = 2000 // 2秒
const WEBHOOK_WAIT_TIME = 10000 // Webhook待機時間: 10秒
const FALLBACK_RETRY_COUNT = 3 // フォールバック時のリトライ回数
const FALLBACK_RETRY_INTERVAL = 2000 // フォールバック時のリトライ間隔: 2秒

type PurchaseStatus = 'checking' | 'verifying' | 'completed' | 'pending' | 'error'

/**
 * 有料コンテンツ取得（購入確認用）
 */
async function checkPaidContentAccess(
  params: { siteId: string; slug: string; sectionId: string; productId: string },
  accessToken: string
): Promise<boolean> {
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${API_BASE_URL}/api/paid-content?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  return response.ok
}

/**
 * Stripe Checkout セッション状態を確認（フォールバック）
 * Webhookが届かなかった場合に、直接Stripeからセッション状態を取得し、
 * 支払い完了であればentitlementを作成する
 */
async function verifyCheckoutSession(
  sessionId: string,
  accessToken: string
): Promise<{ verified: boolean; error?: string }> {
  const params = new URLSearchParams({ sessionId })
  const response = await fetch(`${API_BASE_URL}/api/checkout/status?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    return { verified: false, error: data.error || 'Verification failed' }
  }

  const data = await response.json()
  return { verified: data.verified }
}

function PurchaseCompleteContent() {
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()

  // アクセストークンを状態として管理
  const [accessToken, setAccessToken] = useState<string | null>(null)
  useEffect(() => {
    if (!authLoading) {
      setAccessToken(getAccessToken())
    }
  }, [user, authLoading])

  const sessionId = searchParams.get('session_id')
  const siteId = searchParams.get('siteId')
  const slug = searchParams.get('slug')
  const sectionId = searchParams.get('sectionId')
  const productId = searchParams.get('productId')

  const [status, setStatus] = useState<PurchaseStatus>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // フォールバック処理が実行されたかどうか
  const fallbackExecuted = useRef(false)

  // コンテンツページへのURL
  const contentUrl = slug ? `/${slug}${sectionId ? `#${sectionId}` : ''}` : null

  // 購入完了確認（/api/paid-contentポーリング）
  const checkPurchaseStatus = useCallback(async () => {
    if (!accessToken || !siteId || !slug || !sectionId || !productId) {
      return false
    }

    try {
      // /api/paid-contentを呼んで200が返れば購入完了
      const hasAccess = await checkPaidContentAccess(
        {
          siteId,
          slug,
          sectionId,
          productId,
        },
        accessToken
      )
      return hasAccess
    } catch {
      // エラーは無視してポーリング継続
      return false
    }
  }, [accessToken, siteId, slug, sectionId, productId])

  // Stripeセッション状態確認（フォールバック）
  const verifyWithStripe = useCallback(async (): Promise<boolean> => {
    if (!accessToken || !sessionId) {
      return false
    }

    // リトライロジック
    for (let i = 0; i < FALLBACK_RETRY_COUNT; i++) {
      try {
        const result = await verifyCheckoutSession(sessionId, accessToken)
        if (result.verified) {
          return true
        }
        // 最後のリトライでなければ待機
        if (i < FALLBACK_RETRY_COUNT - 1) {
          await new Promise(resolve => setTimeout(resolve, FALLBACK_RETRY_INTERVAL))
        }
      } catch {
        // エラーは無視してリトライ
        if (i < FALLBACK_RETRY_COUNT - 1) {
          await new Promise(resolve => setTimeout(resolve, FALLBACK_RETRY_INTERVAL))
        }
      }
    }
    return false
  }, [accessToken, sessionId])

  // ポーリング処理
  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setErrorMessage('セッション情報が見つかりません')
      return
    }

    if (!accessToken) {
      // 認証待ち
      return
    }

    let isMounted = true
    let pollingInterval: NodeJS.Timeout | null = null
    let webhookTimer: NodeJS.Timeout | null = null
    let elapsedTimer: NodeJS.Timeout | null = null

    const startPolling = async () => {
      // 経過時間カウンター
      elapsedTimer = setInterval(() => {
        if (isMounted) {
          setElapsedTime((prev) => prev + 1)
        }
      }, 1000)

      // Webhook待機後のフォールバック処理
      webhookTimer = setTimeout(async () => {
        if (!isMounted || fallbackExecuted.current) return
        fallbackExecuted.current = true

        // フォールバック: Stripe APIで直接確認
        if (isMounted) {
          setStatus('verifying')
        }

        const verified = await verifyWithStripe()

        if (!isMounted) return

        if (verified) {
          // Stripe確認成功、もう一度コンテンツアクセスを試行
          const hasAccess = await checkPurchaseStatus()
          if (hasAccess) {
            setStatus('completed')
          } else {
            // entitlementは作成されたがコンテンツアクセスは失敗
            // それでも購入は完了している可能性が高いので完了扱い
            setStatus('completed')
          }
        } else {
          // Stripe確認も失敗
          setStatus('pending')
        }

        if (pollingInterval) clearInterval(pollingInterval)
        if (elapsedTimer) clearInterval(elapsedTimer)
      }, WEBHOOK_WAIT_TIME)

      // ポーリング開始
      const poll = async () => {
        const isCompleted = await checkPurchaseStatus()
        if (isMounted && isCompleted) {
          setStatus('completed')
          if (pollingInterval) clearInterval(pollingInterval)
          if (webhookTimer) clearTimeout(webhookTimer)
          if (elapsedTimer) clearInterval(elapsedTimer)
        }
      }

      // 初回チェック
      await poll()

      // 定期ポーリング（Webhook待機中のみ）
      if (status === 'checking') {
        pollingInterval = setInterval(poll, POLLING_INTERVAL)
      }
    }

    startPolling()

    return () => {
      isMounted = false
      if (pollingInterval) clearInterval(pollingInterval)
      if (webhookTimer) clearTimeout(webhookTimer)
      if (elapsedTimer) clearInterval(elapsedTimer)
    }
  }, [sessionId, accessToken, checkPurchaseStatus, verifyWithStripe, status])

  // パラメータ不足エラー
  if (!sessionId || !siteId || !slug || !sectionId || !productId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fd-background">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
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
          <h1 className="text-2xl font-bold text-fd-foreground mb-2">
            エラーが発生しました
          </h1>
          <p className="text-fd-muted-foreground mb-6">
            購入情報を取得できませんでした。URLが正しくない可能性があります。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
          >
            トップページへ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fd-background">
      <div className="max-w-md mx-auto p-8 text-center">
        {/* 確認中（Webhook待機） */}
        {status === 'checking' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <svg
                className="animate-spin w-full h-full text-fd-primary"
                fill="none"
                viewBox="0 0 24 24"
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
            </div>
            <h1 className="text-2xl font-bold text-fd-foreground mb-2">
              購入処理を確認中...
            </h1>
            <p className="text-fd-muted-foreground mb-4">
              お支払いの処理を確認しています。しばらくお待ちください。
            </p>
            <p className="text-sm text-fd-muted-foreground">
              経過時間: {elapsedTime}秒
            </p>
          </>
        )}

        {/* Stripe確認中（フォールバック） */}
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <svg
                className="animate-spin w-full h-full text-fd-primary"
                fill="none"
                viewBox="0 0 24 24"
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
            </div>
            <h1 className="text-2xl font-bold text-fd-foreground mb-2">
              決済状態を確認中...
            </h1>
            <p className="text-fd-muted-foreground mb-4">
              決済システムに問い合わせています。もう少々お待ちください。
            </p>
            <p className="text-sm text-fd-muted-foreground">
              経過時間: {elapsedTime}秒
            </p>
          </>
        )}

        {/* 完了 */}
        {status === 'completed' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-fd-foreground mb-2">
              購入が完了しました！
            </h1>
            <p className="text-fd-muted-foreground mb-6">
              ありがとうございます。コンテンツをお楽しみください。
            </p>
            {contentUrl && (
              <Link
                href={contentUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
              >
                コンテンツを見る
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
              </Link>
            )}
          </>
        )}

        {/* 処理中（フォールバックも失敗） */}
        {status === 'pending' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-fd-foreground mb-2">
              処理中です
            </h1>
            <p className="text-fd-muted-foreground mb-6">
              お支払いの処理に時間がかかっています。
              <br />
              しばらくしてからコンテンツページをご確認ください。
            </p>
            {contentUrl && (
              <Link
                href={contentUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
              >
                コンテンツページへ
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
              </Link>
            )}
          </>
        )}

        {/* エラー */}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-fd-foreground mb-2">
              エラーが発生しました
            </h1>
            <p className="text-fd-muted-foreground mb-6">
              {errorMessage || '購入処理の確認中にエラーが発生しました。'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
            >
              トップページへ戻る
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PurchaseCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-fd-background">
          <div className="w-16 h-16">
            <svg
              className="animate-spin w-full h-full text-fd-primary"
              fill="none"
              viewBox="0 0 24 24"
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
          </div>
        </div>
      }
    >
      <PurchaseCompleteContent />
    </Suspense>
  )
}
