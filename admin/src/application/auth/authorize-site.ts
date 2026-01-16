import type { AuthClaims } from '../../domain/auth/claims.js'
import { canAccessSite } from '../../domain/auth/site-scope.js'

export function authorizeSiteScope(claims: AuthClaims, siteId: string): boolean {
  return canAccessSite(claims.siteIds, siteId)
}
