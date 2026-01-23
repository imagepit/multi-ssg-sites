import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { startXOAuthFlow } from '../../../application/x-promotion/start-x-oauth-flow.js'
import { XApiClientImpl } from '../../../infrastructure/x/x-api-client-impl.js'
import { KVOAuthStateStore } from '../../../infrastructure/kv/kv-oauth-state-store.js'

export async function handleXAuthStart(
  request: Request,
  env: Env,
  auth: AuthClaims | null
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

  const url = new URL(request.url)
  const campaignId = url.searchParams.get('campaignId') ?? undefined
  const callbackUrl = url.searchParams.get('callbackUrl') ?? env.X_CALLBACK_URL

  try {
    const xApiClient = new XApiClientImpl({
      clientId: env.X_CLIENT_ID,
      clientSecret: env.X_CLIENT_SECRET,
      callbackUrl: env.X_CALLBACK_URL,
    })

    const stateStore = new KVOAuthStateStore(env.X_OAUTH_STATE)

    const result = await startXOAuthFlow(
      {
        userId: auth?.sub ?? 'anonymous',
        callbackUrl,
        campaignId,
      },
      {
        xApiClient,
        stateStore,
      }
    )

    return new Response(
      JSON.stringify({
        authorizationUrl: result.authorizationUrl,
        state: result.state,
      }),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
