import type { UserReadRepository } from './user-repository.js'
import type { TokenIssuer } from './token-issuer.js'

export interface RefreshTokenInput {
  refreshToken: string
}

export interface RefreshTokenDeps {
  userReadRepo: UserReadRepository
  tokenIssuer: TokenIssuer
}

export interface RefreshTokenResult {
  accessToken: string
}

export async function refreshToken(
  input: RefreshTokenInput,
  deps: RefreshTokenDeps
): Promise<RefreshTokenResult> {
  if (!input.refreshToken) {
    throw new Error('refreshToken is required')
  }

  const payload = await deps.tokenIssuer.verifyRefreshToken(input.refreshToken)

  const user = await deps.userReadRepo.findById(payload.sub)
  if (!user) {
    throw new Error('user not found')
  }

  if (user.status !== 'active') {
    throw new Error('user is not active')
  }

  const accessToken = await deps.tokenIssuer.issueAccessToken({
    sub: user.id,
    email: user.email,
    roles: payload.roles,
    siteIds: payload.siteIds
  })

  return { accessToken }
}
