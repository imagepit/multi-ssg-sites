export type {
  XPromotionCampaignReadRepository,
  XPromotionCampaignWriteRepository,
} from './x-promotion-campaign-repository.js'

export type {
  XUserConnectionReadRepository,
  XUserConnectionWriteRepository,
} from './x-user-connection-repository.js'

export type {
  XPromotionRedemptionReadRepository,
  XPromotionRedemptionWriteRepository,
} from './x-promotion-redemption-repository.js'

export type {
  XApiClient,
  XOAuthConfig,
  XOAuthStartResult,
  XOAuthTokenResult,
  XUserInfo,
  XRepostCheckResult,
} from './x-api-client.js'

export {
  syncProducts,
  type SyncProductsInput,
  type SyncProductsDeps,
  type SyncProductsResult,
  type ProductSyncInput,
  type XPromotionInput,
} from './sync-products.js'

export {
  startXOAuthFlow,
  type StartXOAuthFlowInput,
  type StartXOAuthFlowDeps,
  type StartXOAuthFlowResult,
  type OAuthStateData,
  type OAuthStateStore,
} from './start-x-oauth-flow.js'

export {
  completeXOAuth,
  type CompleteXOAuthInput,
  type CompleteXOAuthDeps,
  type CompleteXOAuthResult,
  type OAuthStateStore as CompleteOAuthStateStore,
} from './complete-x-oauth.js'

export {
  verifyRepostAndGrantAccess,
  type VerifyRepostAndGrantAccessInput,
  type VerifyRepostAndGrantAccessDeps,
  type VerifyRepostAndGrantAccessResult,
  type VerifyRepostFailReason,
} from './verify-repost-and-grant-access.js'
