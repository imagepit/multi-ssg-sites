'use client'

import { AuthProvider } from './AuthContext'
import type { ReactNode } from 'react'

interface AuthProviderWrapperProps {
  children: ReactNode
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>
}
