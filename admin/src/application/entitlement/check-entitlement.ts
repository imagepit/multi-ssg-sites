import { isEntitlementActive } from '../../domain/entitlement/entitlement.js'
import type { EntitlementReadRepository } from './entitlement-repository.js'
import type { ProductReadRepository } from './product-repository.js'

export interface CheckEntitlementInput {
  userId: string
  productId: string
}

export interface CheckEntitlementDeps {
  entitlementRepo: EntitlementReadRepository
  productRepo: ProductReadRepository
}

export interface CheckEntitlementResult {
  hasAccess: boolean
  productId: string
  productName?: string
}

export async function checkEntitlement(
  input: CheckEntitlementInput,
  deps: CheckEntitlementDeps
): Promise<CheckEntitlementResult> {
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }

  const product = await deps.productRepo.findById(input.productId)
  if (!product) {
    throw new Error('product not found')
  }

  if (product.status !== 'active') {
    throw new Error('product is not available')
  }

  const entitlement = await deps.entitlementRepo.findByUserAndProduct(
    input.userId,
    input.productId
  )

  const hasAccess = entitlement ? isEntitlementActive(entitlement) : false

  return {
    hasAccess,
    productId: product.id,
    productName: product.name
  }
}
