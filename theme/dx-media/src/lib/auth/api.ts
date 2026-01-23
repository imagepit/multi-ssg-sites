/**
 * 認証APIクライアント
 * @techdoc/auth からの再エクスポート
 */

export {
  setApiBaseUrl,
  getApiBaseUrl,
  requestMagicLink,
  verifyMagicLink,
  refreshAccessToken,
  fetchCurrentUser,
  refreshTokenIfNeeded,
  fetchWithAuth,
} from '@techdoc/auth'
