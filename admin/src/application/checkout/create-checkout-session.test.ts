import { describe, it, expect, beforeEach } from 'vitest'
import { createCheckoutSession } from './create-checkout-session.js'
import type { StripeClient, CreateStripeCheckoutInput, StripeCheckoutResult } from './stripe-client.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { Product } from '../../domain/entitlement/product.js'

class FakeProductReader implements ProductReadRepository {
  private products: Map<string, Product> = new Map()

  addProduct(product: Product): void {
    this.products.set(product.id, product)
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null
  }

  async findBySiteId(_siteId: string): Promise<Product[]> {
    return []
  }

  async findSubscriptionBySiteId(_siteId: string): Promise<Product | null> {
    return null
  }
}

class FakeStripeClient implements StripeClient {
  lastInput: CreateStripeCheckoutInput | null = null

  async createCheckoutSession(input: CreateStripeCheckoutInput): Promise<StripeCheckoutResult> {
    this.lastInput = input
    return {
      sessionId: 'cs_test_123',
      checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123'
    }
  }
}

describe('createCheckoutSession', () => {
  let productReader: FakeProductReader
  let stripeClient: FakeStripeClient

  beforeEach(() => {
    productReader = new FakeProductReader()
    stripeClient = new FakeStripeClient()
  })

  it('should create a checkout session for a valid product', async () => {
    productReader.addProduct({
      id: 'product-123',
      name: 'Test Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: 'price_123',
      productType: 'single',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const result = await createCheckoutSession(
      {
        userId: 'user-456',
        productId: 'product-123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.checkoutUrl).toBe('https://checkout.stripe.com/pay/cs_test_123')
    }

    expect(stripeClient.lastInput).toMatchObject({
      priceId: 'price_123',
      userId: 'user-456',
      productId: 'product-123',
      mode: 'payment'
    })
  })

  it('should return error when product not found', async () => {
    const result = await createCheckoutSession(
      {
        userId: 'user-456',
        productId: 'nonexistent',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Product not found')
    }
  })

  it('should return error when product is archived', async () => {
    productReader.addProduct({
      id: 'product-123',
      name: 'Archived Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'archived',
      stripePriceId: 'price_123',
      productType: 'single',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const result = await createCheckoutSession(
      {
        userId: 'user-456',
        productId: 'product-123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Product is not available')
    }
  })

  it('should return error when product has no stripe price id', async () => {
    productReader.addProduct({
      id: 'product-123',
      name: 'No Stripe Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: null,
      productType: 'single',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const result = await createCheckoutSession(
      {
        userId: 'user-456',
        productId: 'product-123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Product is not configured for Stripe payment')
    }
  })

  it('should return error for invalid request', async () => {
    const result = await createCheckoutSession(
      {
        userId: '',
        productId: 'product-123',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('userId is required')
    }
  })

  it('should support subscription mode', async () => {
    productReader.addProduct({
      id: 'product-sub',
      name: 'Subscription Product',
      siteId: 'site-1',
      price: 980,
      currency: 'JPY',
      status: 'active',
      stripePriceId: 'price_sub_123',
      productType: 'subscription',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    })

    const result = await createCheckoutSession(
      {
        userId: 'user-456',
        productId: 'product-sub',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        mode: 'subscription'
      },
      { productReader, stripeClient }
    )

    expect(result.success).toBe(true)
    expect(stripeClient.lastInput?.mode).toBe('subscription')
  })
})
