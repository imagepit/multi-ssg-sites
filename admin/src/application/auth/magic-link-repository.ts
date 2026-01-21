import type { MagicLinkToken } from '../../domain/auth/magic-link-token.js'

export interface MagicLinkRepository {
  create(token: MagicLinkToken): Promise<void>
  findByTokenHash(tokenHash: string): Promise<MagicLinkToken | null>
  markUsed(id: string, usedAt: string): Promise<void>
  deleteExpired(): Promise<number>
}
