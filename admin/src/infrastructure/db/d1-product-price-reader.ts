import type { ProductPrice, BillingPeriod } from '../../domain/entitlement/product.js'
import type { ProductPriceReadRepository } from '../../application/entitlement/product-price-repository.js'

interface ProductPriceRow {
  id: string
  product_id: string
  billing_period: string
  price: number
  stripe_price_id: string
  label: string | null
  badge: string | null
  created_at: string
}

export class D1ProductPriceReader implements ProductPriceReadRepository {
  constructor(private readonly db: D1Database) {}

  async findByProductId(productId: string): Promise<ProductPrice[]> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, billing_period, price, stripe_price_id, label, badge, created_at
         FROM product_prices
         WHERE product_id = ?
         ORDER BY billing_period ASC`
      )
      .bind(productId)
      .all<ProductPriceRow>()

    return (result.results ?? []).map((row) => this.mapRowToProductPrice(row))
  }

  async findByProductAndBillingPeriod(
    productId: string,
    billingPeriod: BillingPeriod
  ): Promise<ProductPrice | null> {
    const result = await this.db
      .prepare(
        `SELECT id, product_id, billing_period, price, stripe_price_id, label, badge, created_at
         FROM product_prices
         WHERE product_id = ? AND billing_period = ?`
      )
      .bind(productId, billingPeriod)
      .first<ProductPriceRow>()

    if (!result) {
      return null
    }

    return this.mapRowToProductPrice(result)
  }

  private mapRowToProductPrice(row: ProductPriceRow): ProductPrice {
    return {
      id: row.id,
      productId: row.product_id,
      billingPeriod: row.billing_period as BillingPeriod,
      price: row.price,
      stripePriceId: row.stripe_price_id,
      label: row.label ?? undefined,
      badge: row.badge ?? undefined,
      createdAt: row.created_at
    }
  }
}
