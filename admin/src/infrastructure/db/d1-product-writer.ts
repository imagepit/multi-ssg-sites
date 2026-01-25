import type { Product } from '../../domain/entitlement/product.js'
import type { ProductSyncRepository } from '../../application/sync/product-sync-repository.js'

export class D1ProductWriter implements ProductSyncRepository {
  constructor(private readonly db: D1Database) {}

  async upsert(product: Product): Promise<{ created: boolean }> {
    const existing = await this.db
      .prepare('SELECT id FROM products WHERE id = ?')
      .bind(product.id)
      .first()

    if (existing) {
      await this.db
        .prepare(
          `UPDATE products SET
            name = ?,
            site_id = ?,
            price = ?,
            currency = ?,
            status = ?,
            stripe_price_id = ?,
            product_type = ?,
            description = ?,
            sale_price = ?,
            sale_starts_at = ?,
            sale_ends_at = ?,
            sale_label = ?,
            updated_at = ?
          WHERE id = ?`
        )
        .bind(
          product.name,
          product.siteId,
          product.price,
          product.currency,
          product.status,
          product.stripePriceId,
          product.productType,
          product.description ?? null,
          product.salePrice ?? null,
          product.saleStartsAt ?? null,
          product.saleEndsAt ?? null,
          product.saleLabel ?? null,
          product.updatedAt,
          product.id
        )
        .run()
      return { created: false }
    }

    await this.db
      .prepare(
        `INSERT INTO products (
          id, name, site_id, price, currency, status, stripe_price_id,
          product_type, description, sale_price, sale_starts_at, sale_ends_at,
          sale_label, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        product.id,
        product.name,
        product.siteId,
        product.price,
        product.currency,
        product.status,
        product.stripePriceId,
        product.productType,
        product.description ?? null,
        product.salePrice ?? null,
        product.saleStartsAt ?? null,
        product.saleEndsAt ?? null,
        product.saleLabel ?? null,
        product.createdAt,
        product.updatedAt
      )
      .run()

    return { created: true }
  }

  async archiveMissing(siteId: string, activeProductIds: string[]): Promise<number> {
    if (activeProductIds.length === 0) {
      // Archive all products for the site
      const result = await this.db
        .prepare(
          `UPDATE products SET status = 'archived', updated_at = ? WHERE site_id = ? AND status = 'active'`
        )
        .bind(new Date().toISOString(), siteId)
        .run()
      return result.meta.changes ?? 0
    }

    // Build placeholders for the IN clause
    const placeholders = activeProductIds.map(() => '?').join(', ')
    const result = await this.db
      .prepare(
        `UPDATE products SET status = 'archived', updated_at = ?
         WHERE site_id = ? AND status = 'active' AND id NOT IN (${placeholders})`
      )
      .bind(new Date().toISOString(), siteId, ...activeProductIds)
      .run()

    return result.meta.changes ?? 0
  }

  async getProductIdsBySiteId(siteId: string): Promise<string[]> {
    const result = await this.db
      .prepare('SELECT id FROM products WHERE site_id = ?')
      .bind(siteId)
      .all<{ id: string }>()

    return (result.results ?? []).map((row) => row.id)
  }
}
