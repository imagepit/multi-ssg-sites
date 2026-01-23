/**
 * @techdoc/auth
 * 認証共通モジュール
 */

// Contexts
export {
  AuthProvider,
  useAuth,
  type AuthContextValue,
  type AuthProviderProps,
  AuthProviderWrapper,
} from './contexts'

// Components
export {
  LoginButton,
  type LoginButtonProps,
  type LoginButtonClassNames,
} from './components'

// Lib
export {
  // Types
  type User,
  type AuthState,
  type TokenPair,
  type VerifyResponse,
  type RefreshResponse,
  type RequestLinkResponse,
  type AuthError,
  type AuthConfig,
  // Token
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  decodeJwtPayload,
  isTokenExpired,
  getTokenRemainingTime,
  // API
  setApiBaseUrl,
  getApiBaseUrl,
  requestMagicLink,
  verifyMagicLink,
  refreshAccessToken,
  fetchCurrentUser,
  refreshTokenIfNeeded,
  fetchWithAuth,
  // Redirect
  validateRedirectUrl,
} from './lib'
