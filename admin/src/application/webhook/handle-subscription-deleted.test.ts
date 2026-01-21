import { describe, it, expect, beforeEach } from 'vitest'
import { handleSubscriptionDeleted } from './handle-subscription-deleted.js'
import type { EntitlementWriteRepository, EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { Entitlement } from '../../domain/entitlement/entitlement.js'

class FakeEntitlementWriter implements EntitlementWriteRepository {
  revokedIds: { id: string; updatedAt: string }[] = []

  async create(_entitlement: Entitlement): Promise<void> {}

  async updateStatus(_id: string, _status: string, _updatedAt: string): Promise<void> {}

  async revoke(id: string, updatedAt: string): Promise<void> {
    this.revokedIds.push({ id, updatedAt })
  }
}

class FakeEntitlementReader implements EntitlementReadRepository {
  private entitlements: Entitlement[] = []

  addEntitlement(entitlement: Entitlement): void {
    this.entitlements.push(entitlement)
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Entitlement | null> {
    return this.entitlements.find((e) => e.userId === userId && e.productId === productId) ?? null
  }

  async listByUserId(_userId: string): Promise<Entitlement[]> {
    return []
  }

  async listByUserAndSite(_userId: string, _siteId: string): Promise<Entitlement[]> {
    return []
  }
}

describe('handleSubscriptionDeleted', () => {
  let entitlementWriter: FakeEntitlementWriter
  let entitlementReader: FakeEntitlementReader

  beforeEach(() => {
    entitlementWriter = new FakeEntitlementWriter()
    entitlementReader = new FakeEntitlementReader()
  })

  it('should revoke entitlement when subscription is deleted', async () => {
    entitlementReader.addEntitlement({
      id: 'ent-123',
      userId: 'user-456',
      productId: 'product-789',
      siteId: 'site-1',
      status: 'active',
      grantedBy: 'stripe',
      grantedAt: '2025-01-01T00:00:00Z',
      expiresAt: null,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: {
            user_id: 'user-456',
            product_id: 'product-789'
          }
        }
      }
    }

    const result = await handleSubscriptionDeleted(event, {
      entitlementWriter,
      entitlementReader
    })

    expect(result.success).toBe(true)
    expect(entitlementWriter.revokedIds).toHaveLength(1)
    expect(entitlementWriter.revokedIds[0].id).toBe('ent-123')
  })

  it('should return error when user_id is missing', async () => {
    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: {
            product_id: 'product-789'
          }
        }
      }
    }

    const result = await handleSubscriptionDeleted(event, {
      entitlementWriter,
      entitlementReader
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Missing user_id in metadata')
    }
  })

  it('should return error when product_id is missing', async () => {
    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: {
            user_id: 'user-456'
          }
        }
      }
    }

    const result = await handleSubscriptionDeleted(event, {
      entitlementWriter,
      entitlementReader
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Missing product_id in metadata')
    }
  })

  it('should succeed even if entitlement not found', async () => {
    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: {
            user_id: 'user-456',
            product_id: 'product-789'
          }
        }
      }
    }

    const result = await handleSubscriptionDeleted(event, {
      entitlementWriter,
      entitlementReader
    })

    expect(result.success).toBe(true)
    expect(entitlementWriter.revokedIds).toHaveLength(0)
  })
})
