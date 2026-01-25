import type { Product, ProductPrice } from '../../domain/entitlement/product.js'

export interface ProductSyncRepository {
  /**
   * Upsert a product (insert or update if exists)
   */
  upsert(product: Product): Promise<{ created: boolean }>

  /**
   * Archive products that are not in the provided IDs list
   */
  archiveMissing(siteId: string, activeProductIds: string[]): Promise<number>

  /**
   * Get all product IDs for a site
   */
  getProductIdsBySiteId(siteId: string): Promise<string[]>
}

export interface ProductPriceSyncRepository {
  /**
   * Upsert a product price (insert or update if exists)
   */
  upsert(price: ProductPrice): Promise<{ created: boolean }>

  /**
   * Delete all prices for a product
   */
  deleteByProductId(productId: string): Promise<void>
}
