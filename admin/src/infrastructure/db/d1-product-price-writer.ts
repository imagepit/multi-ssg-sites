import type { ProductPrice } from '../../domain/entitlement/product.js'
import type { ProductPriceSyncRepository } from '../../application/sync/product-sync-repository.js'

export class D1ProductPriceWriter implements ProductPriceSyncRepository {
  constructor(private readonly db: D1Database) {}

  async upsert(price: ProductPrice): Promise<{ created: boolean }> {
    const existing = await this.db
      .prepare('SELECT id FROM product_prices WHERE id = ?')
      .bind(price.id)
      .first()

    if (existing) {
      await this.db
        .prepare(
          `UPDATE product_prices SET
            product_id = ?,
            billing_period = ?,
            price = ?,
            stripe_price_id = ?,
            label = ?,
            badge = ?,
            sale_price = ?,
            sale_starts_at = ?,
            sale_ends_at = ?,
            sale_label = ?,
            stripe_coupon_id = ?
          WHERE id = ?`
        )
        .bind(
          price.productId,
          price.billingPeriod,
          price.price,
          price.stripePriceId,
          price.label ?? null,
          price.badge ?? null,
          price.salePrice ?? null,
          price.saleStartsAt ?? null,
          price.saleEndsAt ?? null,
          price.saleLabel ?? null,
          price.stripeCouponId ?? null,
          price.id
        )
        .run()
      return { created: false }
    }

    await this.db
      .prepare(
        `INSERT INTO product_prices (
          id, product_id, billing_period, price, stripe_price_id,
          label, badge, sale_price, sale_starts_at, sale_ends_at,
          sale_label, stripe_coupon_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        price.id,
        price.productId,
        price.billingPeriod,
        price.price,
        price.stripePriceId,
        price.label ?? null,
        price.badge ?? null,
        price.salePrice ?? null,
        price.saleStartsAt ?? null,
        price.saleEndsAt ?? null,
        price.saleLabel ?? null,
        price.stripeCouponId ?? null,
        price.createdAt
      )
      .run()

    return { created: true }
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM product_prices WHERE product_id = ?')
      .bind(productId)
      .run()
  }
}
