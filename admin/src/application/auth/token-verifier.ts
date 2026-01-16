import type { AuthClaims } from '../../domain/auth/claims.js'

export interface TokenVerifier {
  verify(token: string): Promise<AuthClaims>
}
