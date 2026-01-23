import type { XApiClient } from './x-api-client.js'
import type { XUserConnectionReadRepository, XUserConnectionWriteRepository } from './x-user-connection-repository.js'
import type { OAuthStateData } from './start-x-oauth-flow.js'
import { createXUserConnection } from '../../domain/x-promotion/x-user-connection.js'

export interface OAuthStateStore {
  get(key: string): Promise<OAuthStateData | null>
  delete(key: string): Promise<void>
}

export interface CompleteXOAuthInput {
  code: string
  state: string
}

export interface CompleteXOAuthDeps {
  xApiClient: XApiClient
  stateStore: OAuthStateStore
  connectionReader: XUserConnectionReadRepository
  connectionWriter: XUserConnectionWriteRepository
  generateId: () => string
}

export interface CompleteXOAuthResult {
  userId: string
  xUserId: string
  xUsername: string
  campaignId?: string
}

export async function completeXOAuth(
  input: CompleteXOAuthInput,
  deps: CompleteXOAuthDeps
): Promise<CompleteXOAuthResult> {
  if (!input.code) {
    throw new Error('code is required')
  }
  if (!input.state) {
    throw new Error('state is required')
  }

  // Retrieve and validate state
  const stateData = await deps.stateStore.get(input.state)
  if (!stateData) {
    throw new Error('Invalid or expired state')
  }

  // Exchange code for tokens
  const tokenResult = await deps.xApiClient.exchangeCodeForTokens(
    input.code,
    stateData.codeVerifier
  )

  // Get user info from X
  const userInfo = await deps.xApiClient.getUserInfo(tokenResult.accessToken)

  // Calculate token expiration
  const tokenExpiresAt = Math.floor(Date.now() / 1000) + tokenResult.expiresIn

  // Check if connection already exists for this user
  const existingConnection = await deps.connectionReader.findByUserId(stateData.userId)

  if (existingConnection) {
    // Update existing connection
    const updatedConnection = {
      ...existingConnection,
      xUserId: userInfo.id,
      xUsername: userInfo.username,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt,
    }
    await deps.connectionWriter.update(updatedConnection)
  } else {
    // Create new connection
    const connection = createXUserConnection({
      id: deps.generateId(),
      userId: stateData.userId,
      xUserId: userInfo.id,
      xUsername: userInfo.username,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt,
    })
    await deps.connectionWriter.create(connection)
  }

  // Clean up state
  await deps.stateStore.delete(input.state)

  return {
    userId: stateData.userId,
    xUserId: userInfo.id,
    xUsername: userInfo.username,
    campaignId: stateData.campaignId,
  }
}
