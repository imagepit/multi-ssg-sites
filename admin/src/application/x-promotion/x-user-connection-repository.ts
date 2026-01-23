import type { XUserConnection } from '../../domain/x-promotion/x-user-connection.js'

export interface XUserConnectionReadRepository {
  findById(id: string): Promise<XUserConnection | null>
  findByUserId(userId: string): Promise<XUserConnection | null>
  findByXUserId(xUserId: string): Promise<XUserConnection | null>
}

export interface XUserConnectionWriteRepository {
  create(connection: XUserConnection): Promise<void>
  update(connection: XUserConnection): Promise<void>
  updateTokens(
    id: string,
    accessToken: string,
    refreshToken: string,
    tokenExpiresAt: number
  ): Promise<void>
  delete(id: string): Promise<void>
  deleteByUserId(userId: string): Promise<void>
}
