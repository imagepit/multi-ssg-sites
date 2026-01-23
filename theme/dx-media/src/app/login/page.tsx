'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading, requestMagicLink } = useAuth()

  const next = searchParams.get('next')

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(next || '/')
    }
  }, [isLoading, isAuthenticated, router, next])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await requestMagicLink(email, next || undefined)
      setIsSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-fd-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  if (isSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-fd-border bg-fd-card p-8 text-center">
          <div className="text-4xl">✉️</div>
          <h1 className="text-xl font-semibold text-fd-foreground">
            メールを送信しました
          </h1>
          <p className="text-fd-muted-foreground">
            <span className="font-medium text-fd-foreground">{email}</span>
            <br />
            にログインリンクを送信しました。
            <br />
            メールを確認してリンクをクリックしてください。
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSent(false)
              setEmail('')
            }}
            className="text-sm text-fd-primary hover:underline"
          >
            別のメールアドレスで試す
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-fd-border bg-fd-card p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-fd-foreground">ログイン</h1>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            メールアドレスを入力してログインリンクを受け取ってください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-fd-foreground"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-fd-border bg-fd-background px-3 py-2 text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-none focus:ring-1 focus:ring-fd-primary"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '送信中...' : 'ログインリンクを送信'}
          </button>
        </form>
      </div>
    </div>
  )
}
