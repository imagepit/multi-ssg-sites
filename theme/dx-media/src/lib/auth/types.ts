/**
 * 認証関連の型定義
 * admin 側の実装に合わせる
 */

export interface User {
  id: string
  email: string
  status: 'active' | 'suspended'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface VerifyResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshResponse {
  accessToken: string
}

export interface RequestLinkResponse {
  message: string
}

export interface AuthError {
  error: string
}
