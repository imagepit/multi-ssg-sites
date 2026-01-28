import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncSiteProducts, type SyncProductsRequest, type SyncProductsDependencies } from './sync-site-products.js'
import type { ProductSyncRepository, ProductPriceSyncRepository } from './product-sync-repository.js'
import type { Product, ProductPrice } from '../../domain/entitlement/product.js'

describe('syncSiteProducts', () => {
  let mockProductRepo: ProductSyncRepository
  let mockPriceRepo: ProductPriceSyncRepository
  let deps: SyncProductsDependencies

  beforeEach(() => {
    mockProductRepo = {
      upsert: vi.fn().mockResolvedValue({ created: true }),
      archiveMissing: vi.fn().mockResolvedValue(0),
      getProductIdsBySiteId: vi.fn().mockResolvedValue([])
    }
    mockPriceRepo = {
      upsert: vi.fn().mockResolvedValue({ created: true }),
      deleteByProductId: vi.fn().mockResolvedValue(undefined)
    }
    deps = {
      productRepository: mockProductRepo,
      priceRepository: mockPriceRepo
    }
  })

  describe('single products', () => {
    it('should upsert single products with site prefix', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          {
            id: 'product:test-course',
            price: 980,
            stripe_price_id: 'price_xxx',
            description: 'Test course'
          }
        ]
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.upserted).toBe(1)
      expect(result.warnings).toHaveLength(0)
      expect(mockProductRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'dx-media:product:test-course',
          siteId: 'dx-media',
          price: 980,
          stripePriceId: 'price_xxx',
          productType: 'single',
          status: 'active'
        })
      )
    })

    it('should handle products with sale info', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          {
            id: 'product:sale-course',
            price: 980,
            stripe_price_id: 'price_xxx',
            sale: {
              price: 490,
              starts_at: '2025-01-01T00:00:00Z',
              ends_at: '2025-01-31T23:59:59Z',
              label: '半額セール'
            }
          }
        ]
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.upserted).toBe(1)
      expect(result.warnings).toHaveLength(0)
      expect(mockProductRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'dx-media:product:sale-course',
          salePrice: 490,
          saleStartsAt: Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000),
          saleEndsAt: Math.floor(new Date('2025-01-31T23:59:59Z').getTime() / 1000),
          saleLabel: '半額セール'
        })
      )
    })

    it('should warn on invalid sale dates', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          {
            id: 'product:invalid-sale',
            price: 980,
            sale: {
              price: 490,
              starts_at: '2025-01-31T00:00:00Z',
              ends_at: '2025-01-01T00:00:00Z', // ends before starts
              label: 'Invalid'
            }
          }
        ]
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.upserted).toBe(1)
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0]).toContain('starts_at >= ends_at')
      // Product should still be upserted but without sale info
      expect(mockProductRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'dx-media:product:invalid-sale',
          salePrice: undefined,
          saleStartsAt: undefined,
          saleEndsAt: undefined
        })
      )
    })

    it('should warn on invalid date format', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          {
            id: 'product:bad-date',
            price: 980,
            sale: {
              price: 490,
              starts_at: 'not-a-date',
              ends_at: '2025-01-31T00:00:00Z',
              label: 'Bad date'
            }
          }
        ]
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0]).toContain('Invalid starts_at date')
    })

    it('should not double-prefix already prefixed IDs', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          {
            id: 'dx-media:product:already-prefixed',
            price: 500
          }
        ]
      }

      await syncSiteProducts(request, deps)

      expect(mockProductRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'dx-media:product:already-prefixed'
        })
      )
    })
  })

  describe('subscription products', () => {
    it('should upsert subscription product with prices', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [],
        subscription: {
          id: 'subscription:premium',
          name: 'プレミアム会員',
          prices: [
            {
              billing_period: 'monthly',
              price: 980,
              stripe_price_id: 'price_monthly',
              label: '月額プラン'
            },
            {
              billing_period: 'yearly',
              price: 9800,
              stripe_price_id: 'price_yearly',
              label: '年額プラン',
              badge: '2ヶ月分お得'
            }
          ]
        }
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.upserted).toBe(1)
      expect(result.prices.upserted).toBe(2)
      expect(mockProductRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'dx-media:subscription:premium',
          name: 'プレミアム会員',
          productType: 'subscription'
        })
      )
      expect(mockPriceRepo.deleteByProductId).toHaveBeenCalledWith('dx-media:subscription:premium')
      expect(mockPriceRepo.upsert).toHaveBeenCalledTimes(2)
    })

    it('should handle subscription price with sale', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [],
        subscription: {
          id: 'subscription:premium',
          name: 'プレミアム会員',
          prices: [
            {
              billing_period: 'yearly',
              price: 9800,
              stripe_price_id: 'price_yearly',
              sale: {
                price: 7800,
                starts_at: '2025-01-01T00:00:00Z',
                ends_at: '2025-01-31T23:59:59Z',
                label: 'お正月セール',
                stripe_coupon_id: 'coupon_xxx'
              }
            }
          ]
        }
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.prices.upserted).toBe(1)
      expect(mockPriceRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          salePrice: 7800,
          saleLabel: 'お正月セール',
          stripeCouponId: 'coupon_xxx'
        })
      )
    })
  })

  describe('archiving', () => {
    it('should archive products not in the sync', async () => {
      mockProductRepo.archiveMissing = vi.fn().mockResolvedValue(2)

      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [{ id: 'product:active', price: 500 }]
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.archived).toBe(2)
      expect(mockProductRepo.archiveMissing).toHaveBeenCalledWith('dx-media', ['dx-media:product:active'])
    })

    it('should not archive products when archiveMissing is false', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [{ id: 'product:active', price: 500 }],
        archiveMissing: false
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.archived).toBe(0)
      expect(mockProductRepo.archiveMissing).not.toHaveBeenCalled()
    })
  })

  describe('combined single and subscription', () => {
    it('should handle both single products and subscription', async () => {
      const request: SyncProductsRequest = {
        siteId: 'dx-media',
        products: [
          { id: 'product:course-1', price: 500 },
          { id: 'product:course-2', price: 1000 }
        ],
        subscription: {
          id: 'subscription:premium',
          name: 'Premium',
          prices: [{ billing_period: 'monthly', price: 980, stripe_price_id: 'price_xxx' }]
        }
      }

      const result = await syncSiteProducts(request, deps)

      expect(result.products.upserted).toBe(3)
      expect(result.prices.upserted).toBe(1)
      expect(mockProductRepo.archiveMissing).toHaveBeenCalledWith('dx-media', [
        'dx-media:product:course-1',
        'dx-media:product:course-2',
        'dx-media:subscription:premium'
      ])
    })
  })
})
