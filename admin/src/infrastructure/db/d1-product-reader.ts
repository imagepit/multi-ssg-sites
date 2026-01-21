import type { Product } from '../../domain/entitlement/product.js'
import type { ProductReadRepository } from '../../application/entitlement/product-repository.js'

interface ProductRow {
  id: string
  name: string
  site_id: string
  price: number
  currency: string
  status: string
  stripe_price_id: string | null
  created_at: string
  updated_at: string
}

export class D1ProductReader implements ProductReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Product | null> {
    const result = await this.db
      .prepare(
        'SELECT id, name, site_id, price, currency, status, stripe_price_id, created_at, updated_at FROM products WHERE id = ?'
      )
      .bind(id)
      .first<ProductRow>()

    if (!result) {
      return null
    }

    return this.mapRowToProduct(result)
  }

  async findBySiteId(siteId: string): Promise<Product[]> {
    const result = await this.db
      .prepare(
        'SELECT id, name, site_id, price, currency, status, stripe_price_id, created_at, updated_at FROM products WHERE site_id = ?'
      )
      .bind(siteId)
      .all<ProductRow>()

    return (result.results ?? []).map((row) => this.mapRowToProduct(row))
  }

  private mapRowToProduct(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      siteId: row.site_id,
      price: row.price,
      currency: row.currency,
      status: row.status as 'active' | 'archived',
      stripePriceId: row.stripe_price_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
