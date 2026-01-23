'use client'

import { useEffect, useState } from 'react'

export interface XOAuthCallbackProps {
  /** API base URL for X auth callback endpoint */
  apiBaseUrl: string
  /** Custom success message */
  successMessage?: string
  /** Custom error message */
  errorMessage?: string
  /** Custom className */
  className?: string
}

/** X (Twitter) icon component */
function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Loading spinner component */
function LoadingSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
  )
}

type CallbackStatus = 'loading' | 'success' | 'error'

/**
 * Component for handling X OAuth callback
 *
 * This component should be rendered on the OAuth callback page (/x/callback).
 * It processes the OAuth code from the URL parameters and communicates
 * the result back to the parent window via postMessage.
 */
export function XOAuthCallback({
  apiBaseUrl,
  successMessage = 'X連携が完了しました。このウィンドウは自動的に閉じます。',
  errorMessage = 'X連携に失敗しました。',
  className = '',
}: XOAuthCallbackProps) {
  const [status, setStatus] = useState<CallbackStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = () => {
      const params = new URLSearchParams(window.location.search)

      // Check for success response from API redirect
      const success = params.get('success')
      const xUserId = params.get('xUserId')
      const xUsername = params.get('xUsername')

      // Check for error response
      const errorParam = params.get('error')
      const errorDescription = params.get('error_description')

      // Handle success (redirected from API with success params)
      if (success === 'true' && xUserId && xUsername) {
        setStatus('success')

        // Notify parent window of success
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'x-oauth-callback',
              success: true,
              xUserId,
              xUsername,
            },
            window.location.origin
          )

          // Close this window after a short delay
          setTimeout(() => {
            window.close()
          }, 2000)
        }
        return
      }

      // Handle OAuth error
      if (errorParam) {
        const message = errorDescription || errorParam
        setError(message)
        setStatus('error')

        // Notify parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'x-oauth-callback',
              success: false,
              error: message,
            },
            window.location.origin
          )
        }
        return
      }

      // If we have code and state, we're in the middle of OAuth flow
      // This shouldn't happen normally since API handles the callback
      const code = params.get('code')
      const state = params.get('state')

      if (code && state) {
        // Redirect to API callback endpoint (should not normally reach here)
        const apiCallbackUrl = new URL(`${apiBaseUrl}/api/x/auth/callback`)
        apiCallbackUrl.searchParams.set('code', code)
        apiCallbackUrl.searchParams.set('state', state)
        window.location.href = apiCallbackUrl.toString()
        return
      }

      // No valid parameters - show error
      const message = '必要なパラメータが不足しています'
      setError(message)
      setStatus('error')

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'x-oauth-callback',
            success: false,
            error: message,
          },
          window.location.origin
        )
      }
    }

    handleCallback()
  }, [apiBaseUrl])

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${className}`}>
      <div className="bg-fd-background rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        {/* X Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
            <XIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Loading state */}
        {status === 'loading' && (
          <>
            <h1 className="text-xl font-semibold text-fd-foreground mb-2">
              X連携中...
            </h1>
            <div className="flex justify-center mb-4">
              <LoadingSpinner className="w-8 h-8 text-fd-primary" />
            </div>
            <p className="text-fd-muted-foreground text-sm">
              しばらくお待ちください
            </p>
          </>
        )}

        {/* Success state */}
        {status === 'success' && (
          <>
            <h1 className="text-xl font-semibold text-fd-foreground mb-2">
              連携完了
            </h1>
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-fd-muted-foreground text-sm">
              {successMessage}
            </p>
          </>
        )}

        {/* Error state */}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-semibold text-fd-foreground mb-2">
              連携エラー
            </h1>
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-500 text-sm mb-4">
              {error || errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.close()}
              className="rounded-lg bg-fd-primary text-fd-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              ウィンドウを閉じる
            </button>
          </>
        )}
      </div>
    </div>
  )
}
