import type { Env } from '../../../env.js'
import { verifyMagicLink } from '../../../application/auth/verify-magic-link.js'
import { D1MagicLinkRepository } from '../../../infrastructure/db/d1-magic-link-repository.js'
import { D1UserReader } from '../../../infrastructure/db/d1-user-reader.js'
import { D1UserWriter } from '../../../infrastructure/db/d1-user-writer.js'
import { JwtTokenIssuer } from '../../../infrastructure/auth/jwt-issuer.js'
import { hashToken, generateId } from '../../../infrastructure/crypto/hash.js'

export async function handleAuthVerify(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Database not configured', { status: 500 })
  }

  if (!env.ADMIN_JWT_SECRET) {
    return new Response('JWT secret not configured', { status: 500 })
  }

  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'token is required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  try {
    const result = await verifyMagicLink(
      { token },
      {
        magicLinkRepo: new D1MagicLinkRepository(env.DB),
        userReadRepo: new D1UserReader(env.DB),
        userWriteRepo: new D1UserWriter(env.DB),
        tokenIssuer: new JwtTokenIssuer({ secret: env.ADMIN_JWT_SECRET }),
        hashToken,
        generateId
      }
    )

    return new Response(
      JSON.stringify({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          status: result.user.status
        }
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    if (message === 'invalid token' || message === 'token expired or already used') {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 401, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
