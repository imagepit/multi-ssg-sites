import type { Product } from '../../domain/entitlement/product.js'

export interface ProductReadRepository {
  findById(id: string): Promise<Product | null>
  findBySiteId(siteId: string): Promise<Product[]>
}
