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
import type { User } from '../lib/types'
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  isTokenExpired,
  getTokenRemainingTime,
} from '../lib/token'
import {
  verifyMagicLink,
  requestMagicLink as apiRequestMagicLink,
  refreshAccessToken,
  fetchCurrentUser,
  setApiBaseUrl,
} from '../lib/api'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  requestMagicLink: (email: string, next?: string) => Promise<void>
  verifyToken: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const REFRESH_BUFFER_SECONDS = 5 * 60 // 有効期限の5分前にリフレッシュ

export interface AuthProviderProps {
  children: ReactNode
  apiBaseUrl: string
}

export function AuthProvider({ children, apiBaseUrl }: AuthProviderProps) {
  // API ベース URL を同期的に設定（useEffect ではなく初期化時に設定）
  setApiBaseUrl(apiBaseUrl)

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
    } catch (error) {
      // 復元失敗時はトークンをクリア
      console.error('[Auth] Failed to restore auth state:', error)
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
