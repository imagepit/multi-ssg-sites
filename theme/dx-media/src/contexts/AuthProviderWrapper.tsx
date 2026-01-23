'use client'

/**
 * 認証プロバイダーラッパー
 * @techdoc/auth を使用し、環境変数からAPIベースURLを取得
 */

import { AuthProvider } from '@techdoc/auth'
import type { ReactNode } from 'react'

interface AuthProviderWrapperProps {
  children: ReactNode
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  return (
    <AuthProvider apiBaseUrl={apiBaseUrl}>
      {children}
    </AuthProvider>
  )
}
