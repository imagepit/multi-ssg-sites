import type { User } from '../../domain/auth/user.js'

export interface UserReadRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}

export interface UserWriteRepository {
  create(user: User): Promise<void>
  update(user: User): Promise<void>
}
