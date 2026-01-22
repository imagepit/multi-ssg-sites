import type { Entitlement } from '../../domain/entitlement/entitlement.js'

export interface EntitlementReadRepository {
  findByUserAndProduct(userId: string, productId: string): Promise<Entitlement | null>
  listByUserId(userId: string): Promise<Entitlement[]>
  listByUserAndSite(userId: string, siteId: string): Promise<Entitlement[]>
  findActiveSubscription(userId: string, siteId: string): Promise<Entitlement | null>
}

export interface EntitlementWriteRepository {
  create(entitlement: Entitlement): Promise<void>
  updateStatus(id: string, status: string, updatedAt: string): Promise<void>
  revoke(id: string, updatedAt: string): Promise<void>
}
