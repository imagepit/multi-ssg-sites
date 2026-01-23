export interface XUserConnection {
  id: string
  userId: string
  xUserId: string
  xUsername: string
  accessToken: string
  refreshToken: string
  tokenExpiresAt: number
  connectedAt: string
}

export interface CreateXUserConnectionInput {
  id: string
  userId: string
  xUserId: string
  xUsername: string
  accessToken: string
  refreshToken: string
  tokenExpiresAt: number
}

export function createXUserConnection(input: CreateXUserConnectionInput): XUserConnection {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.xUserId) {
    throw new Error('xUserId is required')
  }
  if (!input.xUsername) {
    throw new Error('xUsername is required')
  }
  if (!input.accessToken) {
    throw new Error('accessToken is required')
  }
  if (!input.refreshToken) {
    throw new Error('refreshToken is required')
  }
  if (!input.tokenExpiresAt || input.tokenExpiresAt <= 0) {
    throw new Error('tokenExpiresAt must be positive')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    userId: input.userId,
    xUserId: input.xUserId,
    xUsername: input.xUsername,
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    tokenExpiresAt: input.tokenExpiresAt,
    connectedAt: now,
  }
}

/**
 * Check if the connection's access token is still valid
 * Returns false if token has expired or will expire within buffer time (5 minutes)
 */
export function isConnectionValid(
  connection: XUserConnection,
  bufferSeconds: number = 5 * 60 // 5 minutes buffer
): boolean {
  const nowSeconds = Math.floor(Date.now() / 1000)
  return connection.tokenExpiresAt > nowSeconds + bufferSeconds
}
