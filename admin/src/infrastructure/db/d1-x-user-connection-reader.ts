import type { XUserConnection } from '../../domain/x-promotion/x-user-connection.js'
import type { XUserConnectionReadRepository } from '../../application/x-promotion/x-user-connection-repository.js'

interface XUserConnectionRow {
  id: string
  user_id: string
  x_user_id: string
  x_username: string
  access_token_encrypted: string
  refresh_token_encrypted: string
  token_expires_at: number
  connected_at: string
}

export class D1XUserConnectionReader implements XUserConnectionReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<XUserConnection | null> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, x_user_id, x_username, access_token_encrypted, refresh_token_encrypted, token_expires_at, connected_at
         FROM x_user_connections
         WHERE id = ?`
      )
      .bind(id)
      .first<XUserConnectionRow>()

    if (!result) {
      return null
    }

    return this.mapRowToConnection(result)
  }

  async findByUserId(userId: string): Promise<XUserConnection | null> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, x_user_id, x_username, access_token_encrypted, refresh_token_encrypted, token_expires_at, connected_at
         FROM x_user_connections
         WHERE user_id = ?`
      )
      .bind(userId)
      .first<XUserConnectionRow>()

    if (!result) {
      return null
    }

    return this.mapRowToConnection(result)
  }

  async findByXUserId(xUserId: string): Promise<XUserConnection | null> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, x_user_id, x_username, access_token_encrypted, refresh_token_encrypted, token_expires_at, connected_at
         FROM x_user_connections
         WHERE x_user_id = ?`
      )
      .bind(xUserId)
      .first<XUserConnectionRow>()

    if (!result) {
      return null
    }

    return this.mapRowToConnection(result)
  }

  private mapRowToConnection(row: XUserConnectionRow): XUserConnection {
    return {
      id: row.id,
      userId: row.user_id,
      xUserId: row.x_user_id,
      xUsername: row.x_username,
      accessToken: row.access_token_encrypted,
      refreshToken: row.refresh_token_encrypted,
      tokenExpiresAt: row.token_expires_at,
      connectedAt: row.connected_at,
    }
  }
}
