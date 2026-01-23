'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react'
import type { User } from '@/lib/auth/types'
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  isTokenExpired,
  getTokenRemainingTime,
} from '@/lib/auth/token'
import {
  verifyMagicLink,
  requestMagicLink as apiRequestMagicLink,
  refreshAccessToken,
  fetchCurrentUser,
} from '@/lib/auth/api'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  requestMagicLink: (email: string, next?: string) => Promise<void>
  verifyToken: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const REFRESH_BUFFER_SECONDS = 5 * 60 // 有効期限の5分前にリフレッシュ

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 自動リフレッシュのスケジュール
   */
  const scheduleRefresh = useCallback((accessToken: string) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
    }

    const remainingTime = getTokenRemainingTime(accessToken)
    const refreshIn = Math.max(0, (remainingTime - REFRESH_BUFFER_SECONDS) * 1000)

    if (refreshIn > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          logout()
          return
        }

        try {
          const result = await refreshAccessToken(refreshToken)
          saveTokens({
            accessToken: result.accessToken,
            refreshToken: refreshToken,
          })
          scheduleRefresh(result.accessToken)
        } catch {
          // リフレッシュ失敗時はログアウト
          logout()
        }
      }, refreshIn)
    }
  }, [])

  /**
   * ログアウト
   */
  const logout = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
    clearTokens()
    setUser(null)
  }, [])

  /**
   * 認証状態を復元
   */
  const restoreAuthState = useCallback(async () => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken || !refreshToken) {
      setIsLoading(false)
      return
    }

    try {
      // アクセストークンが期限切れの場合はリフレッシュ
      if (isTokenExpired(accessToken)) {
        const result = await refreshAccessToken(refreshToken)
        saveTokens({
          accessToken: result.accessToken,
          refreshToken: refreshToken,
        })
        const userInfo = await fetchCurrentUser(result.accessToken)
        setUser(userInfo)
        scheduleRefresh(result.accessToken)
      } else {
        const userInfo = await fetchCurrentUser(accessToken)
        setUser(userInfo)
        scheduleRefresh(accessToken)
      }
    } catch {
      // 復元失敗時はトークンをクリア
      clearTokens()
    } finally {
      setIsLoading(false)
    }
  }, [scheduleRefresh])

  /**
   * マジックリンク送信リクエスト
   */
  const requestMagicLink = useCallback(async (email: string, next?: string) => {
    await apiRequestMagicLink(email, next)
  }, [])

  /**
   * マジックリンク検証・ログイン
   */
  const verifyToken = useCallback(async (token: string) => {
    const result = await verifyMagicLink(token)
    saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
    setUser(result.user)
    scheduleRefresh(result.accessToken)
  }, [scheduleRefresh])

  /**
   * 初期化
   */
  useEffect(() => {
    restoreAuthState()

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
    }
  }, [restoreAuthState])

  /**
   * 複数タブ同期: storage イベント監視
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (e.newValue === null) {
          // 他タブでログアウト
          logout()
        } else {
          // 他タブでトークン更新 → 状態を再読み込み
          restoreAuthState()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [logout, restoreAuthState])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    requestMagicLink,
    verifyToken,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
