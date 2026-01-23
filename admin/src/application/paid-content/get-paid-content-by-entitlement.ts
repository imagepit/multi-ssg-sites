import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { SignedUrlGenerator } from './signed-url-generator.js'

export interface GetPaidContentByEntitlementInput {
  entitlementId: string
  siteId: string
  slug: string
  sectionId: string
}

export interface GetPaidContentByEntitlementDeps {
  entitlementRepo: EntitlementReadRepository
  signedUrlGenerator: SignedUrlGenerator
  checkContentExists: (key: string) => Promise<boolean>
}

export interface GetPaidContentByEntitlementResult {
  url: string
  ttl: number
}

const DEFAULT_TTL_SECONDS = 300 // 5 minutes

/**
 * Get paid content URL by entitlement ID
 * Used for X promotion where anonymous users have entitlements
 */
export async function getPaidContentByEntitlement(
  input: GetPaidContentByEntitlementInput,
  deps: GetPaidContentByEntitlementDeps
): Promise<GetPaidContentByEntitlementResult> {
  if (!input.entitlementId) {
    throw new Error('entitlementId is required')
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

  // Verify entitlement exists and is active
  const entitlement = await deps.entitlementRepo.findById(input.entitlementId)
  if (!entitlement) {
    throw new Error('entitlement not found')
  }

  if (entitlement.status !== 'active') {
    throw new Error('entitlement is not active')
  }

  // Check if entitlement matches the site
  if (entitlement.siteId !== input.siteId) {
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
