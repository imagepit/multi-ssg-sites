export type ProductStatus = 'active' | 'archived'

export interface Product {
  id: string
  name: string
  siteId: string
  price: number
  currency: string
  status: ProductStatus
  stripePriceId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateProductInput {
  id: string
  name: string
  siteId: string
  price?: number
  currency?: string
  status?: ProductStatus
  stripePriceId?: string | null
}

export function createProduct(input: CreateProductInput): Product {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.name) {
    throw new Error('name is required')
  }
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (input.price !== undefined && input.price < 0) {
    throw new Error('price must be non-negative')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    name: input.name.trim(),
    siteId: input.siteId,
    price: input.price ?? 0,
    currency: input.currency ?? 'JPY',
    status: input.status ?? 'active',
    stripePriceId: input.stripePriceId ?? null,
    createdAt: now,
    updatedAt: now
  }
}
