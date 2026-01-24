'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePurchaseComplete } from '@techdoc/paid'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

function PurchaseCompleteContent() {
  const searchParams = useSearchParams()

  const { status, errorMessage, elapsedTime, contentUrl, hasValidParams } = usePurchaseComplete({
    apiBaseUrl: API_BASE_URL,
    params: {
      sessionId: searchParams.get('session_id'),
      siteId: searchParams.get('siteId'),
      slug: searchParams.get('slug'),
      sectionId: searchParams.get('sectionId'),
      productId: searchParams.get('productId'),
    },
  })

  // パラメータ不足エラー
  if (!hasValidParams) {
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
