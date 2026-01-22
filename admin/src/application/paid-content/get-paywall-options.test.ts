import { describe, it, expect, vi } from 'vitest'
import { getPaywallOptions } from './get-paywall-options.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { ProductPriceReadRepository } from '../entitlement/product-price-repository.js'
import type { Product, ProductPrice } from '../../domain/entitlement/product.js'

describe('getPaywallOptions', () => {
  const createMockDeps = () => {
    const singleProduct: Product = {
      id: 'product-single',
      name: 'DX入門コース',
      siteId: 'dx-media',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: 'price_single_123',
      productType: 'single',
      description: '有料コンテンツにはテキスト1,837字が含まれています',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    const subscriptionProduct: Product = {
      id: 'subscription-all-access',
      name: '読み放題プラン',
      siteId: 'dx-media',
      price: 0,
      currency: 'JPY',
      status: 'active',
      stripePriceId: null,
      productType: 'subscription',
      description: '400超の全コンテンツを読み放題',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }

    const monthlyPrice: ProductPrice = {
      id: 'price-monthly',
      productId: 'subscription-all-access',
      billingPeriod: 'monthly',
      price: 2980,
      stripePriceId: 'price_monthly_xxx',
      label: '月額プラン',
      createdAt: '2025-01-01T00:00:00Z'
    }

    const yearlyPrice: ProductPrice = {
      id: 'price-yearly',
      productId: 'subscription-all-access',
      billingPeriod: 'yearly',
      price: 29800,
      stripePriceId: 'price_yearly_yyy',
      label: '年額プラン',
      badge: '2ヶ月分お得',
      createdAt: '2025-01-01T00:00:00Z'
    }

    const productRepo: ProductReadRepository = {
      findById: vi.fn().mockResolvedValue(singleProduct),
      findBySiteId: vi.fn().mockResolvedValue([singleProduct, subscriptionProduct]),
      findSubscriptionBySiteId: vi.fn().mockResolvedValue(subscriptionProduct)
    }

    const productPriceRepo: ProductPriceReadRepository = {
      findByProductId: vi.fn().mockResolvedValue([monthlyPrice, yearlyPrice]),
      findByProductAndBillingPeriod: vi.fn()
    }

    return {
      productRepo,
      productPriceRepo,
      singleProduct,
      subscriptionProduct,
      monthlyPrice,
      yearlyPrice
    }
  }

  it('returns both single purchase and subscription options', async () => {
    const deps = createMockDeps()

    const result = await getPaywallOptions(
      { siteId: 'dx-media', productId: 'product-single' },
      deps
    )

    expect(result.singlePurchase).toEqual({
      productId: 'product-single',
      price: 980,
      description: '有料コンテンツにはテキスト1,837字が含まれています',
      stripePriceId: 'price_single_123'
    })

    expect(result.subscription).toEqual({
      productId: 'subscription-all-access',
      name: '読み放題プラン',
      description: '400超の全コンテンツを読み放題',
      prices: [
        {
          billingPeriod: 'monthly',
          price: 2980,
          stripePriceId: 'price_monthly_xxx',
          label: '月額プラン',
          badge: undefined
        },
        {
          billingPeriod: 'yearly',
          price: 29800,
          stripePriceId: 'price_yearly_yyy',
          label: '年額プラン',
          badge: '2ヶ月分お得'
        }
      ]
    })
  })

  it('returns only single purchase when no subscription exists', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.productRepo.findSubscriptionBySiteId).mockResolvedValue(null)

    const result = await getPaywallOptions(
      { siteId: 'dx-media', productId: 'product-single' },
      deps
    )

    expect(result.singlePurchase).toBeDefined()
    expect(result.subscription).toBeUndefined()
  })

  it('returns only subscription when product is subscription type', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.productRepo.findById).mockResolvedValue(deps.subscriptionProduct)

    const result = await getPaywallOptions(
      { siteId: 'dx-media', productId: 'subscription-all-access' },
      deps
    )

    expect(result.singlePurchase).toBeUndefined()
    expect(result.subscription).toBeDefined()
  })

  it('throws error when product not found', async () => {
    const deps = createMockDeps()
    vi.mocked(deps.productRepo.findById).mockResolvedValue(null)

    await expect(
      getPaywallOptions({ siteId: 'dx-media', productId: 'nonexistent' }, deps)
    ).rejects.toThrow('Product not found')
  })

  it('throws error when siteId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaywallOptions({ siteId: '', productId: 'product-single' }, deps)
    ).rejects.toThrow('siteId is required')
  })

  it('throws error when productId is missing', async () => {
    const deps = createMockDeps()

    await expect(
      getPaywallOptions({ siteId: 'dx-media', productId: '' }, deps)
    ).rejects.toThrow('productId is required')
  })
})
