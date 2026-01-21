import { describe, it, expect } from 'vitest'
import {
  createCheckoutSessionRequest,
  validateCheckoutSessionRequest,
  type CheckoutSessionRequest
} from './checkout-session.js'

describe('CheckoutSession', () => {
  describe('createCheckoutSessionRequest', () => {
    it('should create a valid checkout session request', () => {
      const request = createCheckoutSessionRequest({
        userId: 'user-123',
        productId: 'product-456',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })

      expect(request.userId).toBe('user-123')
      expect(request.productId).toBe('product-456')
      expect(request.successUrl).toBe('https://example.com/success')
      expect(request.cancelUrl).toBe('https://example.com/cancel')
      expect(request.mode).toBe('payment')
    })

    it('should allow subscription mode', () => {
      const request = createCheckoutSessionRequest({
        userId: 'user-123',
        productId: 'product-456',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        mode: 'subscription'
      })

      expect(request.mode).toBe('subscription')
    })
  })

  describe('validateCheckoutSessionRequest', () => {
    it('should return null for valid request', () => {
      const request: CheckoutSessionRequest = {
        userId: 'user-123',
        productId: 'product-456',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        mode: 'payment'
      }

      expect(validateCheckoutSessionRequest(request)).toBeNull()
    })

    it('should return error for missing userId', () => {
      const request = {
        userId: '',
        productId: 'product-456',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        mode: 'payment' as const
      }

      expect(validateCheckoutSessionRequest(request)).toBe('userId is required')
    })

    it('should return error for missing productId', () => {
      const request = {
        userId: 'user-123',
        productId: '',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        mode: 'payment' as const
      }

      expect(validateCheckoutSessionRequest(request)).toBe('productId is required')
    })

    it('should return error for invalid successUrl', () => {
      const request = {
        userId: 'user-123',
        productId: 'product-456',
        successUrl: 'not-a-url',
        cancelUrl: 'https://example.com/cancel',
        mode: 'payment' as const
      }

      expect(validateCheckoutSessionRequest(request)).toBe('successUrl must be a valid URL')
    })

    it('should return error for invalid cancelUrl', () => {
      const request = {
        userId: 'user-123',
        productId: 'product-456',
        successUrl: 'https://example.com/success',
        cancelUrl: 'not-a-url',
        mode: 'payment' as const
      }

      expect(validateCheckoutSessionRequest(request)).toBe('cancelUrl must be a valid URL')
    })
  })
})
