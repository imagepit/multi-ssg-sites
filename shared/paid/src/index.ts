// Types
export type {
  SaleInfo,
  SinglePurchaseOption,
  SubscriptionPriceOption,
  SubscriptionOption,
  PaywallOptions,
  PaidContentError,
  PaidSectionProps,
  PurchaseStatus,
  PurchaseReturnContext,
  CreateCheckoutParams,
  FetchPaidContentParams,
  UsePaidSectionResult,
  UsePurchaseCompleteResult,
  PurchaseCompleteParams,
} from './lib/types'

// API functions
export {
  fetchPaywallInfo,
  fetchPaidContent,
  checkPaidContentAccess,
  createCheckoutSession,
  verifyCheckoutSession,
} from './lib/api'

// Hooks
export { usePaidSection } from './hooks/usePaidSection'
export type { UsePaidSectionOptions } from './hooks/usePaidSection'

export { usePurchaseComplete } from './hooks/usePurchaseComplete'
export type { UsePurchaseCompleteOptions } from './hooks/usePurchaseComplete'
