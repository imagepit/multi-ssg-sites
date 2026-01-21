import type { MagicLinkToken } from '../../domain/auth/magic-link-token.js'
import type { MagicLinkRepository } from '../../application/auth/magic-link-repository.js'

interface MagicLinkRow {
  id: string
  email: string
  token_hash: string
  expires_at: string
  used_at: string | null
  created_at: string
}

export class D1MagicLinkRepository implements MagicLinkRepository {
  constructor(private readonly db: D1Database) {}

  async create(token: MagicLinkToken): Promise<void> {
    await this.db
      .prepare(
        'INSERT INTO magic_link_tokens (id, email, token_hash, expires_at, used_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        token.id,
        token.email,
        token.tokenHash,
        token.expiresAt,
        token.usedAt,
        token.createdAt
      )
      .run()
  }

  async findByTokenHash(tokenHash: string): Promise<MagicLinkToken | null> {
    const result = await this.db
      .prepare(
        'SELECT id, email, token_hash, expires_at, used_at, created_at FROM magic_link_tokens WHERE token_hash = ?'
      )
      .bind(tokenHash)
      .first<MagicLinkRow>()

    if (!result) {
      return null
    }

    return this.mapRowToToken(result)
  }

  async markUsed(id: string, usedAt: string): Promise<void> {
    await this.db
      .prepare('UPDATE magic_link_tokens SET used_at = ? WHERE id = ?')
      .bind(usedAt, id)
      .run()
  }

  async deleteExpired(): Promise<number> {
    const now = new Date().toISOString()
    const result = await this.db
      .prepare('DELETE FROM magic_link_tokens WHERE expires_at < ?')
      .bind(now)
      .run()

    return result.meta.changes ?? 0
  }

  private mapRowToToken(row: MagicLinkRow): MagicLinkToken {
    return {
      id: row.id,
      email: row.email,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at
    }
  }
}
