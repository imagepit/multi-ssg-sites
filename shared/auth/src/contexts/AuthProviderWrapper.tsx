'use client'

import { AuthProvider } from './AuthContext'
import type { ReactNode } from 'react'

interface AuthProviderWrapperProps {
  children: ReactNode
  apiBaseUrl: string
}

export function AuthProviderWrapper({ children, apiBaseUrl }: AuthProviderWrapperProps) {
  return <AuthProvider apiBaseUrl={apiBaseUrl}>{children}</AuthProvider>
}
