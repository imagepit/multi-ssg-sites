import type { XUserConnection } from '../../domain/x-promotion/x-user-connection.js'
import type { XUserConnectionWriteRepository } from '../../application/x-promotion/x-user-connection-repository.js'

export class D1XUserConnectionWriter implements XUserConnectionWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(connection: XUserConnection): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO x_user_connections
         (id, user_id, x_user_id, x_username, access_token_encrypted, refresh_token_encrypted, token_expires_at, connected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        connection.id,
        connection.userId,
        connection.xUserId,
        connection.xUsername,
        connection.accessToken,
        connection.refreshToken,
        connection.tokenExpiresAt,
        connection.connectedAt
      )
      .run()
  }

  async update(connection: XUserConnection): Promise<void> {
    await this.db
      .prepare(
        `UPDATE x_user_connections
         SET x_user_id = ?, x_username = ?, access_token_encrypted = ?, refresh_token_encrypted = ?, token_expires_at = ?
         WHERE id = ?`
      )
      .bind(
        connection.xUserId,
        connection.xUsername,
        connection.accessToken,
        connection.refreshToken,
        connection.tokenExpiresAt,
        connection.id
      )
      .run()
  }

  async updateTokens(
    id: string,
    accessToken: string,
    refreshToken: string,
    tokenExpiresAt: number
  ): Promise<void> {
    await this.db
      .prepare(
        `UPDATE x_user_connections
         SET access_token_encrypted = ?, refresh_token_encrypted = ?, token_expires_at = ?
         WHERE id = ?`
      )
      .bind(accessToken, refreshToken, tokenExpiresAt, id)
      .run()
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM x_user_connections WHERE id = ?')
      .bind(id)
      .run()
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM x_user_connections WHERE user_id = ?')
      .bind(userId)
      .run()
  }
}
