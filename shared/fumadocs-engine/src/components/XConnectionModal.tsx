'use client'

import { useState, useEffect, type ReactNode } from 'react'

export interface XConnectionModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback when modal is closed */
  onClose: () => void
  /** Callback when X connection is successful */
  onSuccess: (connectionInfo: { xUserId: string; xUsername: string }) => void
  /** Callback when X connection fails */
  onError?: (error: string) => void
  /** API base URL for X auth endpoints */
  apiBaseUrl: string
  /** Campaign ID (optional, for tracking) */
  campaignId?: string
  /** Custom title */
  title?: string
  /** Custom description */
  description?: ReactNode
  /** Additional className for the modal */
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

/**
 * Modal component for initiating X (Twitter) OAuth connection
 *
 * This component handles the OAuth flow:
 * 1. User clicks connect button
 * 2. Opens X authorization in new window
 * 3. Listens for postMessage from callback
 * 4. Reports success/failure to parent component
 */
export function XConnectionModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  apiBaseUrl,
  campaignId,
  title = 'X（Twitter）連携',
  description,
  className = '',
}: XConnectionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listen for OAuth callback message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin (should match your callback page origin)
      if (event.data?.type === 'x-oauth-callback') {
        if (event.data.success) {
          onSuccess({
            xUserId: event.data.xUserId,
            xUsername: event.data.xUsername,
          })
          onClose()
        } else {
          const errorMessage = event.data.error || 'X連携に失敗しました'
          setError(errorMessage)
          onError?.(errorMessage)
        }
        setIsLoading(false)
      }
    }

    if (isOpen) {
      window.addEventListener('message', handleMessage)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [isOpen, onSuccess, onError, onClose])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build the auth start URL
      const url = new URL(`${apiBaseUrl}/api/x/auth/start`)
      if (campaignId) {
        url.searchParams.set('campaignId', campaignId)
      }
      // Set callback URL to current origin
      url.searchParams.set('callbackUrl', `${window.location.origin}/x/callback`)

      // Fetch authorization URL from API
      const response = await fetch(url.toString(), {
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'X連携の開始に失敗しました')
      }

      const { authorizationUrl } = await response.json()

      // Open authorization URL in popup window
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        authorizationUrl,
        'x-oauth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      )

      // Check if popup was blocked
      if (!popup) {
        throw new Error('ポップアップがブロックされました。ポップアップを許可してください。')
      }

      // Poll to check if popup is closed without completing auth
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup)
          setIsLoading(false)
        }
      }, 500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'X連携に失敗しました'
      setError(errorMessage)
      onError?.(errorMessage)
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  const defaultDescription = (
    <>
      X（Twitter）アカウントと連携することで、リポストによるコンテンツ解放機能を利用できます。
    </>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative bg-fd-background rounded-lg shadow-xl max-w-md w-full mx-4 p-6 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="x-connection-title"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-fd-muted-foreground hover:text-fd-foreground transition"
          aria-label="閉じる"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <XIcon className="w-6 h-6 text-white" />
          </div>
          <h2
            id="x-connection-title"
            className="text-xl font-semibold text-fd-foreground"
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-fd-muted-foreground text-sm mb-6">
          {description || defaultDescription}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Connect button */}
        <button
          type="button"
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full rounded-lg bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5" />
              連携中...
            </>
          ) : (
            <>
              <XIcon className="w-5 h-5" />
              X（Twitter）と連携する
            </>
          )}
        </button>

        {/* Footer note */}
        <p className="mt-4 text-xs text-fd-muted-foreground text-center">
          連携することで、あなたのXアカウント情報（ユーザー名、プロフィール画像）にアクセスします。
        </p>
      </div>
    </div>
  )
}
