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
} from './lib/types.js'

// API functions
export {
  fetchPaywallInfo,
  fetchPaidContent,
  checkPaidContentAccess,
  createCheckoutSession,
  verifyCheckoutSession,
} from './lib/api.js'

// Hooks
export { usePaidSection } from './hooks/usePaidSection.js'
export type { UsePaidSectionOptions } from './hooks/usePaidSection.js'

export { usePurchaseComplete } from './hooks/usePurchaseComplete.js'
export type { UsePurchaseCompleteOptions } from './hooks/usePurchaseComplete.js'
