import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchPaywallInfo,
  buildPaywallUrl,
  type PaywallInfo,
} from './paywall-api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('usePaywall pure functions', () => {
  const apiBaseUrl = 'https://api.example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('buildPaywallUrl', () => {
    it('should build correct URL with encoded productId', () => {
      const url = buildPaywallUrl({
        siteId: 'site1',
        productId: 'product:course-1',
        apiBaseUrl,
      })

      expect(url).toBe('https://api.example.com/api/paywall?siteId=site1&productId=product%3Acourse-1')
    })

    it('should handle special characters in siteId', () => {
      const url = buildPaywallUrl({
        siteId: 'site-1',
        productId: 'product:course-1',
        apiBaseUrl,
      })

      expect(url).toBe('https://api.example.com/api/paywall?siteId=site-1&productId=product%3Acourse-1')
    })
  })

  describe('fetchPaywallInfo', () => {
    it('should fetch paywall info successfully', async () => {
      const mockPaywallInfo: PaywallInfo = {
        productId: 'product:course-1',
        productName: 'AI入門コース',
        price: 3980,
        currency: 'JPY',
        stripePriceId: 'price_xxx',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPaywallInfo),
      })

      const result = await fetchPaywallInfo({
        siteId: 'site1',
        productId: 'product:course-1',
        apiBaseUrl,
      })

      expect(result).toEqual(mockPaywallInfo)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/paywall?siteId=site1&productId=product%3Acourse-1',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('should fetch paywall info with sale information', async () => {
      const mockPaywallInfo: PaywallInfo = {
        productId: 'product:course-1',
        productName: 'AI入門コース',
        price: 3980,
        currency: 'JPY',
        stripePriceId: 'price_xxx',
        salePrice: 2980,
        saleEndsAt: 1706745600000, // 2024-02-01
        saleLabel: '期間限定セール',
        subscriptionOptions: [
          {
            productId: 'product:subscription-1',
            name: 'プレミアムプラン',
            prices: [
              { billingPeriod: 'monthly', price: 980, stripePriceId: 'price_monthly' },
              { billingPeriod: 'yearly', price: 9800, stripePriceId: 'price_yearly' },
            ],
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPaywallInfo),
      })

      const result = await fetchPaywallInfo({
        siteId: 'site1',
        productId: 'product:course-1',
        apiBaseUrl,
      })

      expect(result).toEqual(mockPaywallInfo)
      expect(result.salePrice).toBe(2980)
      expect(result.subscriptionOptions).toHaveLength(1)
    })

    it('should throw error on 404 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Product not found' }),
      })

      await expect(
        fetchPaywallInfo({
          siteId: 'site1',
          productId: 'nonexistent',
          apiBaseUrl,
        })
      ).rejects.toThrow('Product not found')
    })

    it('should throw error on HTTP error without message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      await expect(
        fetchPaywallInfo({
          siteId: 'site1',
          productId: 'product:course-1',
          apiBaseUrl,
        })
      ).rejects.toThrow('HTTP error! status: 500')
    })

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        fetchPaywallInfo({
          siteId: 'site1',
          productId: 'product:course-1',
          apiBaseUrl,
        })
      ).rejects.toThrow('Network error')
    })
  })
})
