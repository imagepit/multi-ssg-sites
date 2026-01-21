import type { User } from '../../domain/auth/user.js'
import type { UserWriteRepository } from '../../application/auth/user-repository.js'

export class D1UserWriter implements UserWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(user: User): Promise<void> {
    const exists = await this.db
      .prepare('SELECT id FROM users WHERE id = ? OR email = ?')
      .bind(user.id, user.email)
      .first()

    if (exists) {
      throw new Error('user already exists')
    }

    await this.db
      .prepare(
        'INSERT INTO users (id, email, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(
        user.id,
        user.email,
        user.status,
        user.createdAt,
        user.updatedAt
      )
      .run()
  }

  async update(user: User): Promise<void> {
    const result = await this.db
      .prepare(
        'UPDATE users SET email = ?, status = ?, updated_at = ? WHERE id = ?'
      )
      .bind(user.email, user.status, user.updatedAt, user.id)
      .run()

    if (!result.meta.changes || result.meta.changes === 0) {
      throw new Error('user not found')
    }
  }
}
