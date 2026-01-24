import type { StripeClient, CheckoutSessionStatus } from './stripe-client.js'
import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { EntitlementWriteRepository } from '../entitlement/entitlement-repository.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'

export interface VerifyCheckoutSessionInput {
  sessionId: string
  userId: string
}

export interface VerifyCheckoutSessionDeps {
  stripeClient: StripeClient
  entitlementReader: EntitlementReadRepository
  entitlementWriter: EntitlementWriteRepository
  productReader: ProductReadRepository
  generateId: () => string
}

export interface VerifyCheckoutSessionResult {
  verified: boolean
  status: CheckoutSessionStatus['status']
  paymentStatus: CheckoutSessionStatus['paymentStatus']
  entitlementCreated: boolean
  error?: string
}

/**
 * Verify checkout session status and create entitlement if payment is complete
 * This is a fallback mechanism when webhook is not received
 */
export async function verifyCheckoutSession(
  input: VerifyCheckoutSessionInput,
  deps: VerifyCheckoutSessionDeps
): Promise<VerifyCheckoutSessionResult> {
  if (!input.sessionId) {
    return {
      verified: false,
      status: 'expired',
      paymentStatus: 'unpaid',
      entitlementCreated: false,
      error: 'sessionId is required'
    }
  }

  // Get session status from Stripe
  let sessionStatus: CheckoutSessionStatus
  try {
    sessionStatus = await deps.stripeClient.getCheckoutSession(input.sessionId)
  } catch (error) {
    return {
      verified: false,
      status: 'expired',
      paymentStatus: 'unpaid',
      entitlementCreated: false,
      error: error instanceof Error ? error.message : 'Failed to get session status'
    }
  }

  // Check if session is complete and paid
  if (sessionStatus.status !== 'complete' || sessionStatus.paymentStatus !== 'paid') {
    return {
      verified: false,
      status: sessionStatus.status,
      paymentStatus: sessionStatus.paymentStatus,
      entitlementCreated: false
    }
  }

  // Verify user matches
  if (sessionStatus.metadata.userId !== input.userId) {
    return {
      verified: false,
      status: sessionStatus.status,
      paymentStatus: sessionStatus.paymentStatus,
      entitlementCreated: false,
      error: 'User mismatch'
    }
  }

  const productId = sessionStatus.metadata.productId
  if (!productId) {
    return {
      verified: false,
      status: sessionStatus.status,
      paymentStatus: sessionStatus.paymentStatus,
      entitlementCreated: false,
      error: 'Product ID not found in session metadata'
    }
  }

  // Check if entitlement already exists
  const existingEntitlement = await deps.entitlementReader.findByUserAndProduct(
    input.userId,
    productId
  )

  if (existingEntitlement) {
    // Entitlement already exists (webhook was processed or already created)
    return {
      verified: true,
      status: sessionStatus.status,
      paymentStatus: sessionStatus.paymentStatus,
      entitlementCreated: false
    }
  }

  // Get product to determine site_id
  const product = await deps.productReader.findById(productId)
  if (!product) {
    return {
      verified: false,
      status: sessionStatus.status,
      paymentStatus: sessionStatus.paymentStatus,
      entitlementCreated: false,
      error: 'Product not found'
    }
  }

  // Create entitlement (webhook fallback)
  const now = new Date().toISOString()
  await deps.entitlementWriter.create({
    id: deps.generateId(),
    userId: input.userId,
    productId,
    siteId: product.siteId,
    status: 'active',
    grantedBy: 'stripe_checkout_verify',
    grantedAt: now,
    expiresAt: null,
    createdAt: now,
    updatedAt: now
  })

  return {
    verified: true,
    status: sessionStatus.status,
    paymentStatus: sessionStatus.paymentStatus,
    entitlementCreated: true
  }
}
