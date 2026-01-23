import { createUser, type User } from '../../domain/auth/user.js'
import { isTokenValid } from '../../domain/auth/magic-link-token.js'
import type { MagicLinkRepository } from './magic-link-repository.js'
import type { UserReadRepository, UserWriteRepository } from './user-repository.js'
import type { TokenIssuer, TokenPair } from './token-issuer.js'

export interface VerifyMagicLinkInput {
  token: string
}

export interface VerifyMagicLinkDeps {
  magicLinkRepo: MagicLinkRepository
  userReadRepo: UserReadRepository
  userWriteRepo: UserWriteRepository
  tokenIssuer: TokenIssuer
  hashToken: (token: string) => Promise<string>
  generateId: () => string
}

export interface VerifyMagicLinkResult {
  accessToken: string
  refreshToken: string
  user: User
}

export async function verifyMagicLink(
  input: VerifyMagicLinkInput,
  deps: VerifyMagicLinkDeps
): Promise<VerifyMagicLinkResult> {
  if (!input.token) {
    throw new Error('token is required')
  }

  const tokenHash = await deps.hashToken(input.token)
  const magicLinkToken = await deps.magicLinkRepo.findByTokenHash(tokenHash)

  if (!magicLinkToken) {
    throw new Error('invalid token')
  }

  if (!isTokenValid(magicLinkToken)) {
    throw new Error('token expired or already used')
  }

  // Mark token as used
  await deps.magicLinkRepo.markUsed(magicLinkToken.id, new Date().toISOString())

  // Find or create user
  let user = await deps.userReadRepo.findByEmail(magicLinkToken.email)

  if (!user) {
    user = createUser({
      id: deps.generateId(),
      email: magicLinkToken.email
    })
    await deps.userWriteRepo.create(user)
  }

  // Issue tokens
  // TODO: ロールはユーザーエンティティから取得すべき
  // 現状は全ユーザーにデフォルトで viewer ロールを付与
  const tokenPair: TokenPair = await deps.tokenIssuer.issueTokenPair({
    sub: user.id,
    email: user.email,
    roles: ['viewer']
  })

  return {
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    user
  }
}
