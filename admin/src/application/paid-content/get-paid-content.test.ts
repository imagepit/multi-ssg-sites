import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPaidContent } from './get-paid-content.js'
import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { Product } from '../../domain/entitlement/product.js'
import type { Entitlement } from '../../domain/entitlement/entitlement.js'

describe('getPaidContent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-27T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockDeps = () => {
    const activeProduct: Product = {
      id: 'dx-media:product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: null,
      productType: 'single',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    }

    const activeEntitlement: Entitlement = {
      id: 'ent-123',
      userId: 'user-123',
      productId: 'dx-media:product-123',
      siteId: 'dx-media',
      status: 'active',
      grantedBy: 'stripe',
      grantedAt: '2025-06-01T00:00:00Z',
      expiresAt: null,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z',
    }

    const entitlementRepo: EntitlementReadRepository = {
      findByUserAndProduct: vi.fn().mockResolvedValue(activeEntitlement),
      listByUserId: vi.fn(),
      listByUserAndSite: vi.fn(),
      findActiveSubscription: vi.fn().mockResolvedValue(null),
    }

    const productRepo: ProductReadRepository = {
      findById: vi.fn().mockResolvedValue(activeProduct),
      findBySiteId: vi.fn(),
      findSubscriptionBySiteId: vi.fn().mockResolvedValue(null),
    }

    const validContent = JSON.stringify({
      html: '<p>Premium content</p>',
      productId: 'product-123',
      sectionId: 'lesson-1',
    })

    const getContent = vi.fn().mockResolvedValue(validContent)

    return {
      entitlementRepo,
      productRepo,
      getContent,
      activeProduct,
      activeEntitlement,
    }
  }

  it('returns HTML content when user has access', async () => {
    const deps = createMockDeps()

    const result = await getPaidContent(
      {
        userId: 'user-123',
        siteId: 'dx-media',
        slug: 'intro-to-dx',
        sectionId: 'lesson-1',
        productId: 'product-123',
      },
      deps
    )

    expect(result.html).toBe('<p>Premium content</p>')
    expect(deps.getContent).toHaveBeenCalledWith(
      'paid/dx-media/intro-to-dx/lesson-1.json'
    )
  })

  it('throws access denied when user has no entitlement', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.entitlementRepo.findByUserAndProduct).mockResolvedValue(null)

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('access denied')
  })

  it('throws content not found when R2 key does not exist', async () => {
    const deps = createMockDeps()
    deps.getContent = vi.fn().mockResolvedValue(null)

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('content not found')
  })

  it('throws product id mismatch when content productId does not match', async () => {
    const deps = createMockDeps()
    deps.getContent = vi.fn().mockResolvedValue(
      JSON.stringify({
        html: '<p>Content</p>',
        productId: 'different-product',
        sectionId: 'lesson-1',
      })
    )

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('product id mismatch')
  })

  it('throws section id mismatch when content sectionId does not match', async () => {
    const deps = createMockDeps()
    deps.getContent = vi.fn().mockResolvedValue(
      JSON.stringify({
        html: '<p>Content</p>',
        productId: 'product-123',
        sectionId: 'different-section',
      })
    )

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('section id mismatch')
  })

  it('does not throw when content has no productId (legacy content)', async () => {
    const deps = createMockDeps()
    deps.getContent = vi.fn().mockResolvedValue(
      JSON.stringify({
        html: '<p>Legacy content</p>',
      })
    )

    const result = await getPaidContent(
      {
        userId: 'user-123',
        siteId: 'dx-media',
        slug: 'intro-to-dx',
        sectionId: 'lesson-1',
        productId: 'product-123',
      },
      deps
    )

    expect(result.html).toBe('<p>Legacy content</p>')
  })

  it('throws error when userId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContent(
        {
          userId: '',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('userId is required')
  })

  it('throws error when siteId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: '',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('siteId is required')
  })

  it('throws error when slug is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: '',
          sectionId: 'lesson-1',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('slug is required')
  })

  it('throws error when sectionId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: '',
          productId: 'product-123',
        },
        deps
      )
    ).rejects.toThrow('sectionId is required')
  })

  it('throws error when productId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaidContent(
        {
          userId: 'user-123',
          siteId: 'dx-media',
          slug: 'intro-to-dx',
          sectionId: 'lesson-1',
          productId: '',
        },
        deps
      )
    ).rejects.toThrow('productId is required')
  })
})
