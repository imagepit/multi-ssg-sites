import { checkEntitlement } from '../entitlement/check-entitlement.js'
import type { EntitlementReadRepository } from '../entitlement/entitlement-repository.js'
import type { ProductReadRepository } from '../entitlement/product-repository.js'

export interface GetPaidContentInput {
  userId: string
  siteId: string
  slug: string
  sectionId: string
  productId: string
}

export interface GetPaidContentDeps {
  entitlementRepo: EntitlementReadRepository
  productRepo: ProductReadRepository
  getContent: (key: string) => Promise<string | null>
}

export interface GetPaidContentResult {
  html: string
}

export async function getPaidContent(
  input: GetPaidContentInput,
  deps: GetPaidContentDeps
): Promise<GetPaidContentResult> {
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
  // Product ID in D1 is stored as "siteId:productId" format
  const fullProductId = `${input.siteId}:${input.productId}`
  const entitlementResult = await checkEntitlement(
    { userId: input.userId, productId: fullProductId },
    { entitlementRepo: deps.entitlementRepo, productRepo: deps.productRepo }
  )

  if (!entitlementResult.hasAccess) {
    throw new Error('access denied')
  }

  // Build R2 key
  const r2Key = `paid/${input.siteId}/${input.slug}/${input.sectionId}.json`

  // Get content from R2
  const contentJson = await deps.getContent(r2Key)
  if (!contentJson) {
    throw new Error('content not found')
  }

  // Parse content JSON
  const content = JSON.parse(contentJson)

  return {
    html: content.html
  }
}
