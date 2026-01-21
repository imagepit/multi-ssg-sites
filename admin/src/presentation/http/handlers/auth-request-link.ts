import type { Env } from '../../../env.js'
import { requestMagicLink } from '../../../application/auth/request-magic-link.js'
import { D1MagicLinkRepository } from '../../../infrastructure/db/d1-magic-link-repository.js'
import { ConsoleMailSender } from '../../../infrastructure/mail/console-mail-sender.js'
import { hashToken, generateSecureToken, generateId } from '../../../infrastructure/crypto/hash.js'

interface RequestLinkBody {
  email: string
}

export async function handleAuthRequestLink(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Database not configured', { status: 500 })
  }

  let body: RequestLinkBody
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'invalid JSON body' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!body.email) {
    return new Response(
      JSON.stringify({ error: 'email is required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  // Determine base URL for magic link
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  try {
    const result = await requestMagicLink(
      {
        email: body.email,
        baseUrl
      },
      {
        magicLinkRepo: new D1MagicLinkRepository(env.DB),
        mailSender: new ConsoleMailSender(), // TODO: Use real mail sender in production
        generateId,
        generateToken: () => generateSecureToken(32),
        hashToken,
        expiresInMinutes: 15
      }
    )

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
