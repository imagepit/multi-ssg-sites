'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { validateRedirectUrl } from '@/lib/auth/redirect'

function AuthCallbackContent() {
  const router = useRouter()
  const { verifyToken } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const hasProcessed = useRef(false)

  useEffect(() => {
    // 既に処理済みなら何もしない（Strict Modeの二重実行対策）
    if (hasProcessed.current) {
      return
    }
    hasProcessed.current = true

    // 1. window.location.searchから直接パラメータを取得
    //    useSearchParamsはreplaceState後に再レンダリングで空になる可能性があるため
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const next = urlParams.get('next')

    // 2. URLからtokenを即座に除去（Referrer/ログ/スクショ漏えい防止）
    window.history.replaceState({}, '', '/auth/callback')

    if (!token) {
      setError('トークンが見つかりません')
      setIsProcessing(false)
      return
    }

    // 3. トークン検証
    verifyAndRedirect(token, next)

    async function verifyAndRedirect(token: string, next: string | null) {
      try {
        await verifyToken(token)

        // 4. リダイレクト先のバリデーション（オープンリダイレクト防止）
        const redirectTo = validateRedirectUrl(next) || '/'
        router.push(redirectTo)
      } catch (err) {
        setError(err instanceof Error ? err.message : '認証に失敗しました')
        setIsProcessing(false)
      }
    }
  }, [router, verifyToken])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-fd-border bg-fd-card p-8 text-center">
          <div className="text-4xl">❌</div>
          <h1 className="text-xl font-semibold text-fd-foreground">
            認証エラー
          </h1>
          <p className="text-fd-muted-foreground">{error}</p>
          <a
            href="/login"
            className="inline-block rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            ログインページへ
          </a>
        </div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-fd-border bg-fd-card p-8 text-center">
          <div className="text-4xl animate-pulse">🔐</div>
          <h1 className="text-xl font-semibold text-fd-foreground">
            認証中...
          </h1>
          <p className="text-fd-muted-foreground">
            しばらくお待ちください
          </p>
        </div>
      </div>
    )
  }

  return null
}

export default function AuthCallbackPage() {
  return <AuthCallbackContent />
}
