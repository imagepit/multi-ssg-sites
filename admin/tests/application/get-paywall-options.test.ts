import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPaywallOptions } from '../../src/application/paid-content/get-paywall-options.js'
import type { ProductReadRepository } from '../../src/application/entitlement/product-repository.js'
import type { ProductPriceReadRepository } from '../../src/application/entitlement/product-price-repository.js'
import type { Product } from '../../src/domain/entitlement/product.js'
import type { ProductPrice } from '../../src/domain/entitlement/product-price.js'

describe('getPaywallOptions', () => {
  let mockProductRepo: ProductReadRepository
  let mockProductPriceRepo: ProductPriceReadRepository

  const createMockProduct = (overrides?: Partial<Product>): Product => ({
    id: 'product:test-course',
    name: 'テストコース',
    siteId: 'dx-media',
    price: 980,
    currency: 'JPY',
    status: 'active',
    stripePriceId: 'price_single_test',
    productType: 'single',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

  const createMockSubscriptionProduct = (overrides?: Partial<Product>): Product => ({
    id: 'subscription:dx-media-all-access',
    name: '読み放題プラン',
    siteId: 'dx-media',
    price: 2980,
    currency: 'JPY',
    status: 'active',
    stripePriceId: 'price_subscription_monthly',
    productType: 'subscription',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

  const createMockProductPrice = (overrides?: Partial<ProductPrice>): ProductPrice => ({
    id: 'price:monthly',
    productId: 'subscription:dx-media-all-access',
    billingPeriod: 'monthly',
    price: 2980,
    currency: 'JPY',
    stripePriceId: 'price_subscription_monthly',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  })

  beforeEach(() => {
    mockProductRepo = {
      findById: vi.fn(),
      findSubscriptionBySiteId: vi.fn(),
    }
    mockProductPriceRepo = {
      findByProductId: vi.fn(),
      findByProductAndBillingPeriod: vi.fn(),
    }
  })

  describe('single purchase with sale', () => {
    it('should include sale info when sale is active', async () => {
      // Arrange
      const now = new Date('2026-01-15T12:00:00+09:00')
      vi.setSystemTime(now)

      const productWithSale = createMockProduct({
        salePrice: 100,
        saleStartsAt: Math.floor(new Date('2026-01-07T22:30:00+09:00').getTime() / 1000),
        saleEndsAt: Math.floor(new Date('2026-02-06T22:30:00+09:00').getTime() / 1000),
        saleLabel: 'セール中',
      })

      vi.mocked(mockProductRepo.findById).mockResolvedValue(productWithSale)
      vi.mocked(mockProductRepo.findSubscriptionBySiteId).mockResolvedValue(null)

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'product:test-course' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.singlePurchase).toBeDefined()
      expect(result.singlePurchase?.sale).toBeDefined()
      expect(result.singlePurchase?.sale?.price).toBe(100)
      expect(result.singlePurchase?.sale?.originalPrice).toBe(980)
      expect(result.singlePurchase?.sale?.label).toBe('セール中')

      vi.useRealTimers()
    })

    it('should not include sale info when sale is not active (before start)', async () => {
      // Arrange
      const now = new Date('2026-01-01T12:00:00+09:00')
      vi.setSystemTime(now)

      const productWithSale = createMockProduct({
        salePrice: 100,
        saleStartsAt: Math.floor(new Date('2026-01-07T22:30:00+09:00').getTime() / 1000),
        saleEndsAt: Math.floor(new Date('2026-02-06T22:30:00+09:00').getTime() / 1000),
        saleLabel: 'セール中',
      })

      vi.mocked(mockProductRepo.findById).mockResolvedValue(productWithSale)
      vi.mocked(mockProductRepo.findSubscriptionBySiteId).mockResolvedValue(null)

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'product:test-course' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.singlePurchase).toBeDefined()
      expect(result.singlePurchase?.sale).toBeUndefined()
      expect(result.singlePurchase?.price).toBe(980)

      vi.useRealTimers()
    })

    it('should not include sale info when sale is not active (after end)', async () => {
      // Arrange
      const now = new Date('2026-03-01T12:00:00+09:00')
      vi.setSystemTime(now)

      const productWithSale = createMockProduct({
        salePrice: 100,
        saleStartsAt: Math.floor(new Date('2026-01-07T22:30:00+09:00').getTime() / 1000),
        saleEndsAt: Math.floor(new Date('2026-02-06T22:30:00+09:00').getTime() / 1000),
        saleLabel: 'セール中',
      })

      vi.mocked(mockProductRepo.findById).mockResolvedValue(productWithSale)
      vi.mocked(mockProductRepo.findSubscriptionBySiteId).mockResolvedValue(null)

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'product:test-course' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.singlePurchase).toBeDefined()
      expect(result.singlePurchase?.sale).toBeUndefined()
      expect(result.singlePurchase?.price).toBe(980)

      vi.useRealTimers()
    })

    it('should not include sale info when product has no sale configured', async () => {
      // Arrange
      const product = createMockProduct()

      vi.mocked(mockProductRepo.findById).mockResolvedValue(product)
      vi.mocked(mockProductRepo.findSubscriptionBySiteId).mockResolvedValue(null)

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'product:test-course' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.singlePurchase).toBeDefined()
      expect(result.singlePurchase?.sale).toBeUndefined()
      expect(result.singlePurchase?.price).toBe(980)
    })
  })

  describe('subscription with sale', () => {
    it('should include sale info for subscription price when sale is active', async () => {
      // Arrange
      const now = new Date('2026-01-15T12:00:00+09:00')
      vi.setSystemTime(now)

      const subscriptionProduct = createMockSubscriptionProduct()
      const priceWithSale = createMockProductPrice({
        salePrice: 980,
        saleStartsAt: Math.floor(new Date('2026-01-07T22:30:00+09:00').getTime() / 1000),
        saleEndsAt: Math.floor(new Date('2026-02-06T22:30:00+09:00').getTime() / 1000),
        saleLabel: '初月限定',
        stripeCouponId: 'coupon_test',
      })

      vi.mocked(mockProductRepo.findById).mockResolvedValue(subscriptionProduct)
      vi.mocked(mockProductPriceRepo.findByProductId).mockResolvedValue([priceWithSale])

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'subscription:dx-media-all-access' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.subscription).toBeDefined()
      expect(result.subscription?.prices[0].sale).toBeDefined()
      expect(result.subscription?.prices[0].sale?.price).toBe(980)
      expect(result.subscription?.prices[0].sale?.originalPrice).toBe(2980)
      expect(result.subscription?.prices[0].sale?.label).toBe('初月限定')
      expect(result.subscription?.prices[0].sale?.stripeCouponId).toBe('coupon_test')

      vi.useRealTimers()
    })

    it('should not include sale info for subscription price when sale is not active', async () => {
      // Arrange
      const now = new Date('2026-03-01T12:00:00+09:00')
      vi.setSystemTime(now)

      const subscriptionProduct = createMockSubscriptionProduct()
      const priceWithSale = createMockProductPrice({
        salePrice: 980,
        saleStartsAt: Math.floor(new Date('2026-01-07T22:30:00+09:00').getTime() / 1000),
        saleEndsAt: Math.floor(new Date('2026-02-06T22:30:00+09:00').getTime() / 1000),
        saleLabel: '初月限定',
        stripeCouponId: 'coupon_test',
      })

      vi.mocked(mockProductRepo.findById).mockResolvedValue(subscriptionProduct)
      vi.mocked(mockProductPriceRepo.findByProductId).mockResolvedValue([priceWithSale])

      // Act
      const result = await getPaywallOptions(
        { siteId: 'dx-media', productId: 'subscription:dx-media-all-access' },
        { productRepo: mockProductRepo, productPriceRepo: mockProductPriceRepo }
      )

      // Assert
      expect(result.subscription).toBeDefined()
      expect(result.subscription?.prices[0].sale).toBeUndefined()
      expect(result.subscription?.prices[0].price).toBe(2980)

      vi.useRealTimers()
    })
  })
})
