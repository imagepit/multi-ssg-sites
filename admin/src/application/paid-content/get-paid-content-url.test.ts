import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPaidContentUrl } from './get-paid-content-url.js'
import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { SignedUrlGenerator } from './signed-url-generator.js'
import type { Product } from '../../domain/entitlement/product.js'
import type { Entitlement } from '../../domain/entitlement/entitlement.js'

describe('getPaidContentUrl', () => {
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

    const signedUrlGenerator: SignedUrlGenerator = {
      generateSignedUrl: vi
        .fn()
        .mockResolvedValue('https://r2.example.com/signed-url')
    }

    const checkContentExists = vi.fn().mockResolvedValue(true)

    return {
      entitlementRepo,
      productRepo,
      signedUrlGenerator,
      checkContentExists,
      activeProduct,
      activeEntitlement
    }
  }

  it('returns signed URL when user has access', async () => {
    const deps = createMockDeps()

    const result = await getPaidContentUrl(
      {
        userId: 'user-123',
        siteId: 'dx-media',
        slug: 'intro-to-dx',
        sectionId: 'lesson-1',
        productId: 'product-123'
      },
      deps
    )

    expect(result.url).toBe('https://r2.example.com/signed-url')
    expect(result.ttl).toBe(300)

    expect(deps.signedUrlGenerator.generateSignedUrl).toHaveBeenCalledWith(
      'paid/dx-media/intro-to-dx/lesson-1.json',
      300
    )
  })

  it('throws access denied when user has no entitlement', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(null)

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('access denied')
  })

  it('throws access denied when entitlement is revoked', async () => {
    const deps = createMockDeps()
    const revokedEntitlement: Entitlement = {
      ...deps.activeEntitlement,
      status: 'revoked'
    }
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(
      revokedEntitlement
    )

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('access denied')
  })

  it('throws content not found when R2 key does not exist', async () => {
    const deps = createMockDeps()
    deps.checkContentExists = vi.fn().mockResolvedValue(false)

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('content not found')
  })

  it('throws error when userId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContentUrl(
        {
          userId: '',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('userId is required')
  })

  it('throws error when siteId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: '',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('siteId is required')
  })

  it('throws error when slug is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: '',
          sectionId: 'lesson-1',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('slug is required')
  })

  it('throws error when sectionId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: '',
          productId: 'product-123'
        },
        deps
      )
    ).rejects.toThrow('sectionId is required')
  })

  it('throws error when productId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContentUrl(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: ''
        },
        deps
      )
    ).rejects.toThrow('productId is required')
  })
})
