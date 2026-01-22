import type { ProductPrice } from '../../domain/entitlement/product.js'

export interface ProductPriceReadRepository {
  findByProductId(productId: string): Promise<ProductPrice[]>
  findByProductAndBillingPeriod(
    productId: string,
    billingPeriod: 'monthly' | 'yearly'
  ): Promise<ProductPrice | null>
}

export interface ProductPriceWriteRepository {
  create(price: ProductPrice): Promise<void>
  deleteByProductId(productId: string): Promise<void>
}
