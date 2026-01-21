import type {
  EntitlementWriteRepository,
  EntitlementReadRepository
} from '../entitlement/entitlement-repository.js'
import type { StripeWebhookEvent } from './stripe-webhook-verifier.js'

export interface HandleSubscriptionDeletedDeps {
  entitlementWriter: EntitlementWriteRepository
  entitlementReader: EntitlementReadRepository
}

export type HandleSubscriptionDeletedResult =
  | { success: true }
  | { success: false; error: string }

export async function handleSubscriptionDeleted(
  event: StripeWebhookEvent,
  deps: HandleSubscriptionDeletedDeps
): Promise<HandleSubscriptionDeletedResult> {
  const subscription = event.data.object as {
    id: string
    metadata?: { user_id?: string; product_id?: string }
  }

  const userId = subscription.metadata?.user_id
  if (!userId) {
    return { success: false, error: 'Missing user_id in metadata' }
  }

  const productId = subscription.metadata?.product_id
  if (!productId) {
    return { success: false, error: 'Missing product_id in metadata' }
  }

  const entitlement = await deps.entitlementReader.findByUserAndProduct(userId, productId)
  if (!entitlement) {
    return { success: true }
  }

  const now = new Date().toISOString()
  await deps.entitlementWriter.revoke(entitlement.id, now)

  return { success: true }
}
