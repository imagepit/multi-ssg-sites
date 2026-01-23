'use client'

import { XOAuthCallback } from '@techdoc/fumadocs-engine/components'

export default function XCallbackPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8787'

  return (
    <XOAuthCallback
      apiBaseUrl={apiBaseUrl}
      successMessage="X連携が完了しました。このウィンドウは自動的に閉じます。"
      errorMessage="X連携に失敗しました。"
    />
  )
}
