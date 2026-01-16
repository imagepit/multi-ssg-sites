import type { AuthClaims } from '../../domain/auth/claims.js'
import type { Role } from '../../domain/auth/roles.js'
import { hasAtLeastRole } from '../../domain/auth/roles.js'

export function authorizeRole(claims: AuthClaims, required: Role): boolean {
  return hasAtLeastRole(claims.roles, required)
}
