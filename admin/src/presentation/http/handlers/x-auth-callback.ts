import type { Env } from '../../../env.js'
import { completeXOAuth } from '../../../application/x-promotion/complete-x-oauth.js'
import { XApiClientImpl } from '../../../infrastructure/x/x-api-client-impl.js'
import { KVOAuthStateStore } from '../../../infrastructure/kv/kv-oauth-state-store.js'
import { D1XUserConnectionReader } from '../../../infrastructure/db/d1-x-user-connection-reader.js'
import { D1XUserConnectionWriter } from '../../../infrastructure/db/d1-x-user-connection-writer.js'

export async function handleXAuthCallback(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET || !env.X_CALLBACK_URL) {
    return new Response(
      JSON.stringify({ error: 'X OAuth not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!env.X_OAUTH_STATE) {
    return new Response(
      JSON.stringify({ error: 'X OAuth state store not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  // Handle OAuth error from X
  if (error) {
    const errorDescription = url.searchParams.get('error_description') ?? error
    return new Response(
      JSON.stringify({ error: errorDescription }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  if (!code || !state) {
    return new Response(
      JSON.stringify({ error: 'code and state are required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  try {
    const xApiClient = new XApiClientImpl({
      clientId: env.X_CLIENT_ID,
      clientSecret: env.X_CLIENT_SECRET,
      callbackUrl: env.X_CALLBACK_URL,
    })

    const stateStore = new KVOAuthStateStore(env.X_OAUTH_STATE)
    const connectionReader = new D1XUserConnectionReader(env.DB)
    const connectionWriter = new D1XUserConnectionWriter(env.DB)

    const result = await completeXOAuth(
      { code, state },
      {
        xApiClient,
        stateStore,
        connectionReader,
        connectionWriter,
        generateId: () => crypto.randomUUID(),
      }
    )

    // Redirect back to the original callback URL with success parameters
    // In production, this would typically be a frontend URL
    return new Response(
      JSON.stringify({
        success: true,
        userId: result.userId,
        xUsername: result.xUsername,
        campaignId: result.campaignId,
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    // Handle specific error cases
    if (message === 'Invalid or expired state') {
      return new Response(
        JSON.stringify({ error: 'OAuth session expired. Please try again.' }),
        { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
