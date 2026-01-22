import { describe, it, expect } from 'vitest'
import {
  createProduct,
  createProductPrice,
  isSubscriptionProduct,
  type ProductType,
  type BillingPeriod
} from './product.js'

describe('createProduct', () => {
  it('creates a product with valid input', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media'
    })

    expect(product.id).toBe('product-123')
    expect(product.name).toBe('DX入門コース')
    expect(product.siteId).toBe('dx-media')
    expect(product.price).toBe(0)
    expect(product.currency).toBe('JPY')
    expect(product.status).toBe('active')
    expect(product.stripePriceId).toBeNull()
    expect(product.createdAt).toBeDefined()
    expect(product.updatedAt).toBeDefined()
  })

  it('creates a product with custom price and currency', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      price: 980,
      currency: 'USD'
    })

    expect(product.price).toBe(980)
    expect(product.currency).toBe('USD')
  })

  it('trims product name', () => {
    const product = createProduct({
      id: 'product-123',
      name: '  DX入門コース  ',
      siteId: 'dx-media'
    })

    expect(product.name).toBe('DX入門コース')
  })

  it('allows setting status to archived', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      status: 'archived'
    })

    expect(product.status).toBe('archived')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createProduct({
        id: '',
        name: 'DX入門コース',
        siteId: 'dx-media'
      })
    ).toThrow('id is required')
  })

  it('throws error when name is missing', () => {
    expect(() =>
      createProduct({
        id: 'product-123',
        name: '',
        siteId: 'dx-media'
      })
    ).toThrow('name is required')
  })

  it('throws error when siteId is missing', () => {
    expect(() =>
      createProduct({
        id: 'product-123',
        name: 'DX入門コース',
        siteId: ''
      })
    ).toThrow('siteId is required')
  })

  it('throws error when price is negative', () => {
    expect(() =>
      createProduct({
        id: 'product-123',
        name: 'DX入門コース',
        siteId: 'dx-media',
        price: -100
      })
    ).toThrow('price must be non-negative')
  })

  it('creates a product with stripePriceId', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      stripePriceId: 'price_abc123'
    })

    expect(product.stripePriceId).toBe('price_abc123')
  })

  it('creates a single product by default', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media'
    })

    expect(product.productType).toBe('single')
  })

  it('creates a subscription product', () => {
    const product = createProduct({
      id: 'subscription-123',
      name: '読み放題プラン',
      siteId: 'dx-media',
      productType: 'subscription',
      description: '400超の全コンテンツを読み放題'
    })

    expect(product.productType).toBe('subscription')
    expect(product.description).toBe('400超の全コンテンツを読み放題')
  })

  it('allows setting description for single product', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      description: '有料コンテンツにはテキスト1,837字が含まれています'
    })

    expect(product.description).toBe('有料コンテンツにはテキスト1,837字が含まれています')
  })
})

describe('createProductPrice', () => {
  it('creates a monthly product price', () => {
    const price = createProductPrice({
      id: 'price-monthly-123',
      productId: 'subscription-123',
      billingPeriod: 'monthly',
      price: 2980,
      stripePriceId: 'price_monthly_xxx'
    })

    expect(price.id).toBe('price-monthly-123')
    expect(price.productId).toBe('subscription-123')
    expect(price.billingPeriod).toBe('monthly')
    expect(price.price).toBe(2980)
    expect(price.stripePriceId).toBe('price_monthly_xxx')
    expect(price.label).toBeUndefined()
    expect(price.badge).toBeUndefined()
    expect(price.createdAt).toBeDefined()
  })

  it('creates a yearly product price with label and badge', () => {
    const price = createProductPrice({
      id: 'price-yearly-123',
      productId: 'subscription-123',
      billingPeriod: 'yearly',
      price: 29800,
      stripePriceId: 'price_yearly_yyy',
      label: '年額プラン',
      badge: '2ヶ月分お得'
    })

    expect(price.billingPeriod).toBe('yearly')
    expect(price.price).toBe(29800)
    expect(price.label).toBe('年額プラン')
    expect(price.badge).toBe('2ヶ月分お得')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createProductPrice({
        id: '',
        productId: 'subscription-123',
        billingPeriod: 'monthly',
        price: 2980,
        stripePriceId: 'price_xxx'
      })
    ).toThrow('id is required')
  })

  it('throws error when productId is missing', () => {
    expect(() =>
      createProductPrice({
        id: 'price-123',
        productId: '',
        billingPeriod: 'monthly',
        price: 2980,
        stripePriceId: 'price_xxx'
      })
    ).toThrow('productId is required')
  })

  it('throws error when stripePriceId is missing', () => {
    expect(() =>
      createProductPrice({
        id: 'price-123',
        productId: 'subscription-123',
        billingPeriod: 'monthly',
        price: 2980,
        stripePriceId: ''
      })
    ).toThrow('stripePriceId is required')
  })

  it('throws error when price is negative', () => {
    expect(() =>
      createProductPrice({
        id: 'price-123',
        productId: 'subscription-123',
        billingPeriod: 'monthly',
        price: -100,
        stripePriceId: 'price_xxx'
      })
    ).toThrow('price must be non-negative')
  })
})

describe('isSubscriptionProduct', () => {
  it('returns true for subscription product', () => {
    const product = createProduct({
      id: 'subscription-123',
      name: '読み放題プラン',
      siteId: 'dx-media',
      productType: 'subscription'
    })

    expect(isSubscriptionProduct(product)).toBe(true)
  })

  it('returns false for single product', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media',
      productType: 'single'
    })

    expect(isSubscriptionProduct(product)).toBe(false)
  })

  it('returns false for default product type', () => {
    const product = createProduct({
      id: 'product-123',
      name: 'DX入門コース',
      siteId: 'dx-media'
    })

    expect(isSubscriptionProduct(product)).toBe(false)
  })
})
