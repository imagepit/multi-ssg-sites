import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  buildSuccessUrl,
  buildCancelUrl,
  createCheckoutSession,
  type CreateCheckoutParams,
} from './checkout-api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock window.location.origin
const originalWindow = global.window
beforeEach(() => {
  ;(global as any).window = {
    location: {
      origin: 'https://example.com',
    },
  }
})
afterEach(() => {
  global.window = originalWindow
})

describe('checkout-api', () => {
  const apiBaseUrl = 'https://api.example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('buildSuccessUrl', () => {
    it('should build success URL with all parameters', () => {
      const url = buildSuccessUrl('https://example.com', {
        siteId: 'site1',
        slug: 'ai/premium-content',
        sectionId: 'section-1',
      })

      expect(url).toBe(
        'https://example.com/purchase-complete?session_id=%7BCHECKOUT_SESSION_ID%7D&siteId=site1&slug=ai%2Fpremium-content&sectionId=section-1'
      )
    })

    it('should encode special characters in slug', () => {
      const url = buildSuccessUrl('https://example.com', {
        siteId: 'site1',
        slug: 'docs/ai topics',
        sectionId: 'section-1',
      })

      expect(url).toContain('slug=docs%2Fai+topics')
    })
  })

  describe('buildCancelUrl', () => {
    it('should build cancel URL with hash', () => {
      const url = buildCancelUrl('https://example.com', 'ai/premium-content', 'section-1')

      expect(url).toBe('https://example.com/ai/premium-content#section-1')
    })
  })

  describe('createCheckoutSession', () => {
    const baseParams: CreateCheckoutParams = {
      productId: 'product:course-1',
      stripePriceId: 'price_xxx',
      mode: 'payment',
      returnContext: {
        siteId: 'site1',
        slug: 'ai/premium-content',
        sectionId: 'section-1',
      },
      apiBaseUrl,
      accessToken: 'test-token',
    }

    it('should create checkout session successfully', async () => {
      const mockResponse = {
        checkoutUrl: 'https://checkout.stripe.com/xxx',
        sessionId: 'cs_xxx',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await createCheckoutSession(baseParams)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/checkout/create',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          body: expect.stringContaining('"productId":"product:course-1"'),
        })
      )
    })

    it('should include billing period for subscription', async () => {
      const mockResponse = {
        checkoutUrl: 'https://checkout.stripe.com/xxx',
        sessionId: 'cs_xxx',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      await createCheckoutSession({
        ...baseParams,
        mode: 'subscription',
        billingPeriod: 'yearly',
      })

      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.mode).toBe('subscription')
      expect(body.billingPeriod).toBe('yearly')
    })

    it('should throw error on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      })

      await expect(createCheckoutSession(baseParams)).rejects.toThrow('Unauthorized')
    })

    it('should throw error on 400', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid price ID' }),
      })

      await expect(createCheckoutSession(baseParams)).rejects.toThrow('Invalid price ID')
    })

    it('should throw default error when no error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      await expect(createCheckoutSession(baseParams)).rejects.toThrow('Checkout creation failed (500)')
    })

    it('should include successUrl and cancelUrl in request body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          checkoutUrl: 'https://checkout.stripe.com/xxx',
          sessionId: 'cs_xxx',
        }),
      })

      await createCheckoutSession(baseParams)

      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.successUrl).toContain('/purchase-complete')
      expect(body.cancelUrl).toContain('#section-1')
    })
  })
})
