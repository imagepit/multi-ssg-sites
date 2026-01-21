export interface StripeWebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}

export interface StripeWebhookVerifier {
  verifySignature(payload: string, signature: string): Promise<StripeWebhookEvent>
}
