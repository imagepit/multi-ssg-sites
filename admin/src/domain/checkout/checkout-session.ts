export type CheckoutMode = 'payment' | 'subscription'

export interface CheckoutSessionRequest {
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode: CheckoutMode
}

export interface CreateCheckoutSessionInput {
  userId: string
  productId: string
  successUrl: string
  cancelUrl: string
  mode?: CheckoutMode
}

export function createCheckoutSessionRequest(
  input: CreateCheckoutSessionInput
): CheckoutSessionRequest {
  return {
    userId: input.userId,
    productId: input.productId,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    mode: input.mode ?? 'payment'
  }
}

export function validateCheckoutSessionRequest(
  request: CheckoutSessionRequest
): string | null {
  if (!request.userId) {
    return 'userId is required'
  }
  if (!request.productId) {
    return 'productId is required'
  }
  if (!isValidUrl(request.successUrl)) {
    return 'successUrl must be a valid URL'
  }
  if (!isValidUrl(request.cancelUrl)) {
    return 'cancelUrl must be a valid URL'
  }
  return null
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}
