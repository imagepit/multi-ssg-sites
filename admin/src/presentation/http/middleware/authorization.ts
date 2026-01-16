import type { AuthClaims } from '../../../domain/auth/claims.js'
import type { Role } from '../../../domain/auth/roles.js'
import { authorizeRole } from '../../../application/auth/authorize-role.js'
import { authorizeSiteScope } from '../../../application/auth/authorize-site.js'

export function requireRole(claims: AuthClaims, required: Role): Response | null {
  if (!authorizeRole(claims, required)) {
    return new Response('Forbidden', { status: 403 })
  }
  return null
}

export function requireSiteScope(claims: AuthClaims, siteId: string | null): Response | null {
  if (!siteId) {
    return new Response('site_id required', { status: 400 })
  }
  if (!authorizeSiteScope(claims, siteId)) {
    return new Response('Forbidden', { status: 403 })
  }
  return null
}
