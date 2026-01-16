import type { AuthClaims } from '../../../domain/auth/claims.js'
import type { TokenVerifier } from '../../../application/auth/token-verifier.js'
import { authenticate } from '../../../application/auth/authenticate.js'

export type AuthDependencies = {
  tokenVerifier: TokenVerifier | null
}

export async function requireAuth(
  request: Request,
  deps: AuthDependencies
): Promise<AuthClaims | Response> {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!deps.tokenVerifier) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const token = header.slice('Bearer '.length)
  try {
    return await authenticate(token, deps.tokenVerifier)
  } catch (error) {
    void error
    return new Response('Unauthorized', { status: 401 })
  }
}
