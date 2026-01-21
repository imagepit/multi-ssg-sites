import { checkEntitlement } from '../entitlement/check-entitlement.js'
import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'
import type { SignedUrlGenerator } from './signed-url-generator.js'

export interface GetPaidContentUrlInput {
  userId: string
  siteId: string
  slug: string
  sectionId: string
  productId: string
}

export interface GetPaidContentUrlDeps {
  entitlementRepo: EntitlementReadRepository
  productRepo: ProductReadRepository
  signedUrlGenerator: SignedUrlGenerator
  checkContentExists: (key: string) => Promise<boolean>
}

export interface GetPaidContentUrlResult {
  url: string
  ttl: number
}

const DEFAULT_TTL_SECONDS = 300 // 5 minutes

export async function getPaidContentUrl(
  input: GetPaidContentUrlInput,
  deps: GetPaidContentUrlDeps
): Promise<GetPaidContentUrlResult> {
  if (!input.userId) {
    throw new Error('userId is required')
  }
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (!input.slug) {
    throw new Error('slug is required')
  }
  if (!input.sectionId) {
    throw new Error('sectionId is required')
  }
  if (!input.productId) {
    throw new Error('productId is required')
  }

  // Check entitlement
  const entitlementResult = await checkEntitlement(
    { userId: input.userId, productId: input.productId },
    { entitlementRepo: deps.entitlementRepo, productRepo: deps.productRepo }
  )

  if (!entitlementResult.hasAccess) {
    throw new Error('access denied')
  }

  // Build R2 key
  const r2Key = `paid/${input.siteId}/${input.slug}/${input.sectionId}.json`

  // Check if content exists
  const exists = await deps.checkContentExists(r2Key)
  if (!exists) {
    throw new Error('content not found')
  }

  // Generate signed URL
  const url = await deps.signedUrlGenerator.generateSignedUrl(
    r2Key,
    DEFAULT_TTL_SECONDS
  )

  return {
    url,
    ttl: DEFAULT_TTL_SECONDS
  }
}
