import type { XApiClient } from './x-api-client.js'

export interface OAuthStateData {
  codeVerifier: string
  userId: string
  callbackUrl: string
  campaignId?: string
  createdAt: number
}

export interface OAuthStateStore {
  set(key: string, value: OAuthStateData, ttlSeconds: number): Promise<void>
}

export interface StartXOAuthFlowInput {
  userId: string
  callbackUrl: string
  campaignId?: string
}

export interface StartXOAuthFlowDeps {
  xApiClient: XApiClient
  stateStore: OAuthStateStore
}

export interface StartXOAuthFlowResult {
  authorizationUrl: string
  state: string
}

/** State TTL: 10 minutes */
const STATE_TTL_SECONDS = 10 * 60

/**
 * Generate a random state string for CSRF protection
 */
function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function startXOAuthFlow(
  input: StartXOAuthFlowInput,
  deps: StartXOAuthFlowDeps
): Promise<StartXOAuthFlowResult> {
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.callbackUrl) {
    throw new Error('callbackUrl is required')
  }

  // Generate state for CSRF protection
  const state = generateState()

  // Start OAuth flow via X API client
  const oauthResult = await deps.xApiClient.startOAuthFlow(state)

  // Store state data for callback verification
  const stateData: OAuthStateData = {
    codeVerifier: oauthResult.codeVerifier,
    userId: input.userId,
    callbackUrl: input.callbackUrl,
    campaignId: input.campaignId,
    createdAt: Date.now(),
  }

  await deps.stateStore.set(oauthResult.state, stateData, STATE_TTL_SECONDS)

  return {
    authorizationUrl: oauthResult.authorizationUrl,
    state: oauthResult.state,
  }
}
