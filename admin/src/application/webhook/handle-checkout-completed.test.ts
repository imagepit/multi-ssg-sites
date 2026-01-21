import { describe, it, expect, beforeEach } from 'vitest'
import { handleCheckoutCompleted } from './handle-checkout-completed.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { EntitlementWriteRepository, EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { Product } from '../../domain/entitlement/product.js'
import type { Entitlement } from '../../domain/entitlement/entitlement.js'

class FakeProductReader implements ProductReadRepository {
  private products: Map<string, Product> = new Map()

  addProduct(product: Product): void {
    this.products.set(product.id, product)
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null
  }

  async findBySiteId(_siteId: string): Promise<Product[]> {
    return []
  }
}

class FakeEntitlementWriter implements EntitlementWriteRepository {
  createdEntitlements: Entitlement[] = []

  async create(entitlement: Entitlement): Promise<void> {
    this.createdEntitlements.push(entitlement)
  }

  async updateStatus(_id: string, _status: string, _updatedAt: string): Promise<void> {}

  async revoke(_id: string, _updatedAt: string): Promise<void> {}
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

describe('handleCheckoutCompleted', () => {
  let productReader: FakeProductReader
  let entitlementWriter: FakeEntitlementWriter
  let entitlementReader: FakeEntitlementReader

  beforeEach(() => {
    productReader = new FakeProductReader()
    entitlementWriter = new FakeEntitlementWriter()
    entitlementReader = new FakeEntitlementReader()
  })

  it('should create entitlement on successful checkout', async () => {
    productReader.addProduct({
      id: 'product-123',
      name: 'Test Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: 'price_123',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            user_id: 'user-456',
            product_id: 'product-123'
          },
          mode: 'payment'
        }
      }
    }

    const result = await handleCheckoutCompleted(event, {
      productReader,
      entitlementWriter,
      entitlementReader,
      generateId: () => 'ent-789'
    })

    expect(result.success).toBe(true)
    expect(entitlementWriter.createdEntitlements).toHaveLength(1)
    expect(entitlementWriter.createdEntitlements[0]).toMatchObject({
      id: 'ent-789',
      userId: 'user-456',
      productId: 'product-123',
      siteId: 'site-1',
      status: 'active',
      grantedBy: 'stripe'
    })
  })

  it('should return error when user_id is missing in metadata', async () => {
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            product_id: 'product-123'
          },
          mode: 'payment'
        }
      }
    }

    const result = await handleCheckoutCompleted(event, {
      productReader,
      entitlementWriter,
      entitlementReader,
      generateId: () => 'ent-789'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Missing user_id in metadata')
    }
  })

  it('should return error when product_id is missing in metadata', async () => {
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            user_id: 'user-456'
          },
          mode: 'payment'
        }
      }
    }

    const result = await handleCheckoutCompleted(event, {
      productReader,
      entitlementWriter,
      entitlementReader,
      generateId: () => 'ent-789'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Missing product_id in metadata')
    }
  })

  it('should return error when product not found', async () => {
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            user_id: 'user-456',
            product_id: 'nonexistent'
          },
          mode: 'payment'
        }
      }
    }

    const result = await handleCheckoutCompleted(event, {
      productReader,
      entitlementWriter,
      entitlementReader,
      generateId: () => 'ent-789'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Product not found')
    }
  })

  it('should skip creating entitlement if user already has one', async () => {
    productReader.addProduct({
      id: 'product-123',
      name: 'Test Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: 'price_123',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    entitlementReader.addEntitlement({
      id: 'existing-ent',
      userId: 'user-456',
      productId: 'product-123',
      siteId: 'site-1',
      status: 'active',
      grantedBy: 'stripe',
      grantedAt: '2025-01-01T00:00:00Z',
      expiresAt: null,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            user_id: 'user-456',
            product_id: 'product-123'
          },
          mode: 'payment'
        }
      }
    }

    const result = await handleCheckoutCompleted(event, {
      productReader,
      entitlementWriter,
      entitlementReader,
      generateId: () => 'ent-789'
    })

    expect(result.success).toBe(true)
    expect(entitlementWriter.createdEntitlements).toHaveLength(0)
  })
})
