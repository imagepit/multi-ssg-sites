import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createEntitlement,
  isEntitlementActive,
  hasActiveEntitlement,
  type Entitlement
} from './entitlement.js'

describe('createEntitlement', () => {
  it('creates an entitlement with valid input', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe'
    })

    expect(entitlement.id).toBe('ent-123')
    expect(entitlement.userId).toBe('user-123')
    expect(entitlement.productId).toBe('product-123')
    expect(entitlement.siteId).toBe('dx-media')
    expect(entitlement.status).toBe('active')
    expect(entitlement.grantedBy).toBe('stripe')
    expect(entitlement.expiresAt).toBeNull()
    expect(entitlement.createdAt).toBeDefined()
    expect(entitlement.updatedAt).toBeDefined()
  })

  it('creates an entitlement with expiration date', () => {
    const expiresAt = '2026-12-31T23:59:59Z'
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'manual',
      expiresAt
    })

    expect(entitlement.expiresAt).toBe(expiresAt)
  })

  it('allows setting status to revoked', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe',
      status: 'revoked'
    })

    expect(entitlement.status).toBe('revoked')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createEntitlement({
        id: '',
        userId: 'user-123',
        productId: 'product-123',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      })
    ).toThrow('id is required')
  })

  it('throws error when userId is missing', () => {
    expect(() =>
      createEntitlement({
        id: 'ent-123',
        userId: '',
        productId: 'product-123',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      })
    ).toThrow('userId is required')
  })

  it('throws error when productId is missing', () => {
    expect(() =>
      createEntitlement({
        id: 'ent-123',
        userId: 'user-123',
        productId: '',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      })
    ).toThrow('productId is required')
  })

  it('throws error when siteId is missing', () => {
    expect(() =>
      createEntitlement({
        id: 'ent-123',
        userId: 'user-123',
        productId: 'product-123',
        siteId: '',
        grantedBy: 'stripe'
      })
    ).toThrow('siteId is required')
  })
})

describe('isEntitlementActive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for active entitlement without expiration', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe'
    })

    expect(isEntitlementActive(entitlement)).toBe(true)
  })

  it('returns true for active entitlement with future expiration', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe',
      expiresAt: '2026-12-31T23:59:59Z'
    })

    expect(isEntitlementActive(entitlement)).toBe(true)
  })

  it('returns false for active entitlement with past expiration', () => {
    const entitlement: Entitlement = {
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      status: 'active',
      grantedBy: 'stripe',
      grantedAt: '2025-01-01T00:00:00Z',
      expiresAt: '2026-01-01T00:00:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    expect(isEntitlementActive(entitlement)).toBe(false)
  })

  it('returns false for revoked entitlement', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe',
      status: 'revoked'
    })

    expect(isEntitlementActive(entitlement)).toBe(false)
  })

  it('returns false for expired status entitlement', () => {
    const entitlement = createEntitlement({
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      grantedBy: 'stripe',
      status: 'expired'
    })

    expect(isEntitlementActive(entitlement)).toBe(false)
  })
})

describe('hasActiveEntitlement', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true when user has active entitlement for product', () => {
    const entitlements = [
      createEntitlement({
        id: 'ent-1',
        userId: 'user-123',
        productId: 'product-A',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      }),
      createEntitlement({
        id: 'ent-2',
        userId: 'user-123',
        productId: 'product-B',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      })
    ]

    expect(hasActiveEntitlement(entitlements, 'product-A')).toBe(true)
    expect(hasActiveEntitlement(entitlements, 'product-B')).toBe(true)
  })

  it('returns false when user does not have entitlement for product', () => {
    const entitlements = [
      createEntitlement({
        id: 'ent-1',
        userId: 'user-123',
        productId: 'product-A',
        siteId: 'dx-media',
        grantedBy: 'stripe'
      })
    ]

    expect(hasActiveEntitlement(entitlements, 'product-B')).toBe(false)
  })

  it('returns false when entitlement is revoked', () => {
    const entitlements = [
      createEntitlement({
        id: 'ent-1',
        userId: 'user-123',
        productId: 'product-A',
        siteId: 'dx-media',
        grantedBy: 'stripe',
        status: 'revoked'
      })
    ]

    expect(hasActiveEntitlement(entitlements, 'product-A')).toBe(false)
  })

  it('returns false when entitlements array is empty', () => {
    expect(hasActiveEntitlement([], 'product-A')).toBe(false)
  })
})
