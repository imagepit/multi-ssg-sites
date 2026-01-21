import type { Entitlement } from '../../domain/entitlement/entitlement.js'
import type { EntitlementWriteRepository } from '../../application/entitlement/entitlement-repository.js'

export class D1EntitlementWriter implements EntitlementWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(entitlement: Entitlement): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO entitlements
         (id, user_id, product_id, site_id, status, granted_by, granted_at, expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        entitlement.id,
        entitlement.userId,
        entitlement.productId,
        entitlement.siteId,
        entitlement.status,
        entitlement.grantedBy,
        entitlement.grantedAt,
        entitlement.expiresAt,
        entitlement.createdAt,
        entitlement.updatedAt
      )
      .run()
  }

  async updateStatus(id: string, status: string, updatedAt: string): Promise<void> {
    await this.db
      .prepare('UPDATE entitlements SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, updatedAt, id)
      .run()
  }

  async revoke(id: string, updatedAt: string): Promise<void> {
    await this.updateStatus(id, 'revoked', updatedAt)
  }
}
