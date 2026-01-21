import { describe, it, expect } from 'vitest'
import { createProduct } from './product.js'

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
})
