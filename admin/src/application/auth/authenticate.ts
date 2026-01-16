import type { AuthClaims } from '../../domain/auth/claims.js'
import type { TokenVerifier } from './token-verifier.js'

export async function authenticate(token: string, verifier: TokenVerifier): Promise<AuthClaims> {
  return verifier.verify(token)
}
