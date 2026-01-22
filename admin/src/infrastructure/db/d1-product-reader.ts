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
  product_type: string
  description: string | null
  created_at: string
  updated_at: string
  sale_price: number | null
  sale_starts_at: number | null
  sale_ends_at: number | null
  sale_label: string | null
}

export class D1ProductReader implements ProductReadRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Product | null> {
    const result = await this.db
      .prepare(
        'SELECT id, name, site_id, price, currency, status, stripe_price_id, product_type, description, created_at, updated_at, sale_price, sale_starts_at, sale_ends_at, sale_label FROM products WHERE id = ?'
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
        'SELECT id, name, site_id, price, currency, status, stripe_price_id, product_type, description, created_at, updated_at, sale_price, sale_starts_at, sale_ends_at, sale_label FROM products WHERE site_id = ?'
      )
      .bind(siteId)
      .all<ProductRow>()

    return (result.results ?? []).map((row) => this.mapRowToProduct(row))
  }

  async findSubscriptionBySiteId(siteId: string): Promise<Product | null> {
    const result = await this.db
      .prepare(
        `SELECT id, name, site_id, price, currency, status, stripe_price_id, product_type, description, created_at, updated_at, sale_price, sale_starts_at, sale_ends_at, sale_label
         FROM products
         WHERE site_id = ? AND product_type = 'subscription' AND status = 'active'
         LIMIT 1`
      )
      .bind(siteId)
      .first<ProductRow>()

    if (!result) {
      return null
    }

    return this.mapRowToProduct(result)
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
      productType: (row.product_type as 'single' | 'subscription') ?? 'single',
      description: row.description ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      salePrice: row.sale_price ?? undefined,
      saleStartsAt: row.sale_starts_at ?? undefined,
      saleEndsAt: row.sale_ends_at ?? undefined,
      saleLabel: row.sale_label ?? undefined
    }
  }
}
