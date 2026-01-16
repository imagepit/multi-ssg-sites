import type { AuthClaims } from '../../../domain/auth/claims.js'
import { normalizeRoles } from '../../../domain/auth/roles.js'

export function whoamiHandler(claims: AuthClaims): Response {
  const body = JSON.stringify({
    sub: claims.sub,
    roles: normalizeRoles(claims.roles),
    siteIds: claims.siteIds ?? []
  })
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}
