import type { AuthClaims } from '../../../domain/auth/claims.js'
import { normalizeRoles } from '../../../domain/auth/roles.js'

export function whoamiHandler(claims: AuthClaims): Response {
  // フロントエンドの User 型と互換性のあるレスポンスを返す
  const body = JSON.stringify({
    id: claims.sub,
    email: claims.email ?? '',
    status: 'active' as const,
    // 追加情報
    roles: normalizeRoles(claims.roles),
    siteIds: claims.siteIds ?? []
  })
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}
