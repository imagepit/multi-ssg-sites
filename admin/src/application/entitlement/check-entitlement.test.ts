import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkEntitlement } from './check-entitlement.js'
import type { EntitlementReadRepository } from './entitlement-repository.js'
import type { ProductReadRepository } from './product-repository.js'
import type { Product } from '../../domain/entitlement/product.js'
import type { Entitlement } from '../../domain/entitlement/entitlement.js'

describe('checkEntitlement', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockDeps = () => {
    const activeProduct: Product = {
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: null,
      productType: 'single',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    const activeEntitlement: Entitlement = {
      id: 'ent-123',
      userId: 'user-123',
      productId: 'product-123',
      siteId: 'dx-media',
      status: 'active',
      grantedBy: 'stripe',
      grantedAt: '2025-06-01T00:00:00Z',
      expiresAt: null,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z'
    }

    const entitlementRepo: EntitlementReadRepository = {
      findById: vi.fn(),
      findByUserAndProduct: vi.fn().mockResolvedValue(activeEntitlement),
      listByUserId: vi.fn(),
      listByUserAndSite: vi.fn(),
      findActiveSubscription: vi.fn().mockResolvedValue(null)
    }

    const productRepo: ProductReadRepository = {
      findById: vi.fn().mockResolvedValue(activeProduct),
      findBySiteId: vi.fn(),
      findSubscriptionBySiteId: vi.fn().mockResolvedValue(null)
    }

    return { entitlementRepo, productRepo, activeProduct, activeEntitlement }
  }

  it('returns hasAccess true when user has active entitlement', async () => {
    const deps = createMockDeps()

    const result = await checkEntitlement(
      { userId: 'user-123', productId: 'product-123' },
      deps
    )

    expect(result.hasAccess).toBe(true)
    expect(result.productId).toBe('product-123')
    expect(result.productName).toBe('DX入門コース')
  })

  it('returns hasAccess false when user has no entitlement', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(null)

    const result = await checkEntitlement(
      { userId: 'user-123', productId: 'product-123' },
      deps
    )

    expect(result.hasAccess).toBe(false)
  })

  it('returns hasAccess false when entitlement is revoked', async () => {
    const deps = createMockDeps()
    const revokedEntitlement: Entitlement = {
      ...deps.activeEntitlement,
      status: 'revoked'
    }
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(
      revokedEntitlement
    )

    const result = await checkEntitlement(
      { userId: 'user-123', productId: 'product-123' },
      deps
    )

    expect(result.hasAccess).toBe(false)
  })

  it('returns hasAccess false when entitlement is expired', async () => {
    const deps = createMockDeps()
    const expiredEntitlement: Entitlement = {
      ...deps.activeEntitlement,
      expiresAt: '2025-12-31T23:59:59Z' // past
    }
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(
      expiredEntitlement
    )

    const result = await checkEntitlement(
      { userId: 'user-123', productId: 'product-123' },
      deps
    )

    expect(result.hasAccess).toBe(false)
  })

  it('throws error when product is not found', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.productRepo.findById).mockResolvedValue(null)

    await expect(
      checkEntitlement({ userId: 'user-123', productId: 'product-123' }, deps)
    ).rejects.toThrow('product not found')
  })

  it('throws error when product is archived', async () => {
    const deps = createMockDeps()
    const archivedProduct: Product = {
      ...deps.activeProduct,
      status: 'archived'
    }
    vi.mocked(deps.productRepo.findById).mockResolvedValue(archivedProduct)

    await expect(
      checkEntitlement({ userId: 'user-123', productId: 'product-123' }, deps)
    ).rejects.toThrow('product is not available')
  })

  it('throws error when userId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      checkEntitlement({ userId: '', productId: 'product-123' }, deps)
    ).rejects.toThrow('userId is required')
  })

  it('throws error when productId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      checkEntitlement({ userId: 'user-123', productId: '' }, deps)
    ).rejects.toThrow('productId is required')
  })
})
