import type { Env } from '../../../env.js'
import { refreshToken } from '../../../application/auth/refresh-token.js'
import { D1UserReader } from '../../../infrastructure/db/d1-user-reader.js'
import { JwtTokenIssuer } from '../../../infrastructure/auth/jwt-issuer.js'

interface RefreshBody {
  refreshToken: string
}

export async function handleAuthRefresh(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Database not configured', { status: 500 })
  }

  if (!env.ADMIN_JWT_SECRET) {
    return new Response('JWT secret not configured', { status: 500 })
  }

  let body: RefreshBody
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'invalid JSON body' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!body.refreshToken) {
    return new Response(
      JSON.stringify({ error: 'refreshToken is required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  try {
    const result = await refreshToken(
      { refreshToken: body.refreshToken },
      {
        userReadRepo: new D1UserReader(env.DB),
        tokenIssuer: new JwtTokenIssuer({ secret: env.ADMIN_JWT_SECRET })
      }
    )

    return new Response(
      JSON.stringify({ accessToken: result.accessToken }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    if (
      message === 'invalid token format' ||
      message === 'invalid signature' ||
      message === 'not a refresh token' ||
      message === 'token expired'
    ) {
      return new Response(
        JSON.stringify({ error: 'invalid refresh token' }),
        { status: 401, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    if (message === 'user not found' || message === 'user is not active') {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
