import type { Entitlement } from '../../domain/entitlement/entitlement.js'
import type { EntitlementReadRepository } from '../../application/entitlement/entitlement-repository.js'

interface EntitlementRow {
  id: string
  user_id: string
  product_id: string
  site_id: string
  status: string
  granted_by: string
  granted_at: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export class D1EntitlementReader implements EntitlementReadRepository {
  constructor(private readonly db: D1Database) {}

  async findByUserAndProduct(
    userId: string,
    productId: string
  ): Promise<Entitlement | null> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, product_id, site_id, status, granted_by, granted_at, expires_at, created_at, updated_at
         FROM entitlements
         WHERE user_id = ? AND product_id = ?`
      )
      .bind(userId, productId)
      .first<EntitlementRow>()

    if (!result) {
      return null
    }

    return this.mapRowToEntitlement(result)
  }

  async listByUserId(userId: string): Promise<Entitlement[]> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, product_id, site_id, status, granted_by, granted_at, expires_at, created_at, updated_at
         FROM entitlements
         WHERE user_id = ?`
      )
      .bind(userId)
      .all<EntitlementRow>()

    return (result.results ?? []).map((row) => this.mapRowToEntitlement(row))
  }

  async listByUserAndSite(userId: string, siteId: string): Promise<Entitlement[]> {
    const result = await this.db
      .prepare(
        `SELECT id, user_id, product_id, site_id, status, granted_by, granted_at, expires_at, created_at, updated_at
         FROM entitlements
         WHERE user_id = ? AND site_id = ?`
      )
      .bind(userId, siteId)
      .all<EntitlementRow>()

    return (result.results ?? []).map((row) => this.mapRowToEntitlement(row))
  }

  private mapRowToEntitlement(row: EntitlementRow): Entitlement {
    return {
      id: row.id,
      userId: row.user_id,
      productId: row.product_id,
      siteId: row.site_id,
      status: row.status as 'active' | 'revoked' | 'expired',
      grantedBy: row.granted_by as 'stripe' | 'manual' | 'promotion',
      grantedAt: row.granted_at,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
