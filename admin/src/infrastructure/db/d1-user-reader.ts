import type { User } from '../../domain/auth/user.js'
import type { UserReadRepository } from '../../application/auth/user-repository.js'

interface UserRow {
  id: string
  email: string
  status: string
  created_at: string
  updated_at: string
}

export class D1UserReader implements UserReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .prepare(
        'SELECT id, email, status, created_at, updated_at FROM users WHERE id = ?'
      )
      .bind(id)
      .first<UserRow>()

    if (!result) {
      return null
    }

    return this.mapRowToUser(result)
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim()
    const result = await this.db
      .prepare(
        'SELECT id, email, status, created_at, updated_at FROM users WHERE email = ?'
      )
      .bind(normalizedEmail)
      .first<UserRow>()

    if (!result) {
      return null
    }

    return this.mapRowToUser(result)
  }

  private mapRowToUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      status: row.status as 'active' | 'suspended',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
