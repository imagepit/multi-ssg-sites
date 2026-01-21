import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type {
  EntitlementWriteRepository,
  EntitlementReadRepository
} from '../entitlement/entitlement-repository.js'
import type { StripeWebhookEvent } from './stripe-webhook-verifier.js'
import { createEntitlement } from '../../domain/entitlement/entitlement.js'

export interface HandleCheckoutCompletedDeps {
  productReader: ProductReadRepository
  entitlementWriter: EntitlementWriteRepository
  entitlementReader: EntitlementReadRepository
  generateId: () => string
}

export type HandleCheckoutCompletedResult =
  | { success: true; entitlementId?: string }
  | { success: false; error: string }

export async function handleCheckoutCompleted(
  event: StripeWebhookEvent,
  deps: HandleCheckoutCompletedDeps
): Promise<HandleCheckoutCompletedResult> {
  const session = event.data.object as {
    id: string
    metadata?: { user_id?: string; product_id?: string }
    mode?: string
  }

  const userId = session.metadata?.user_id
  if (!userId) {
    return { success: false, error: 'Missing user_id in metadata' }
  }

  const productId = session.metadata?.product_id
  if (!productId) {
    return { success: false, error: 'Missing product_id in metadata' }
  }

  const product = await deps.productReader.findById(productId)
  if (!product) {
    return { success: false, error: 'Product not found' }
  }

  const existingEntitlement = await deps.entitlementReader.findByUserAndProduct(
    userId,
    productId
  )
  if (existingEntitlement) {
    return { success: true }
  }

  const entitlement = createEntitlement({
    id: deps.generateId(),
    userId,
    productId,
    siteId: product.siteId,
    grantedBy: 'stripe'
  })

  await deps.entitlementWriter.create(entitlement)

  return { success: true, entitlementId: entitlement.id }
}
