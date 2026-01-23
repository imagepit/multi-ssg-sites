import type { Env } from '../../../env.js'
import { getPaidContentByEntitlement } from '../../../application/paid-content/get-paid-content-by-entitlement.js'
import { D1EntitlementReader } from '../../../infrastructure/db/d1-entitlement-reader.js'
import {
  R2SignedUrlGenerator,
  createContentExistsChecker
} from '../../../infrastructure/r2/r2-signed-url-generator.js'

/**
 * Handle GET /api/paid-content/by-entitlement
 * Retrieves paid content by entitlement ID (for X promotion anonymous users)
 */
export async function handlePaidContentByEntitlement(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Database not configured', { status: 500 })
  }

  if (!env.PAID_CONTENT) {
    return new Response('R2 bucket not configured', { status: 500 })
  }

  const url = new URL(request.url)
  const entitlementId = url.searchParams.get('entitlementId')
  const siteId = url.searchParams.get('siteId')
  const slug = url.searchParams.get('slug')
  const sectionId = url.searchParams.get('sectionId')

  if (!entitlementId || !siteId || !slug || !sectionId) {
    return new Response(
      JSON.stringify({ error: 'entitlementId, siteId, slug, and sectionId are required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  // Get public URL for R2 bucket
  const bucketPublicUrl = `https://${env.ENV ?? 'dev'}.r2.example.com`

  try {
    const result = await getPaidContentByEntitlement(
      {
        entitlementId,
        siteId,
        slug,
        sectionId,
      },
      {
        entitlementRepo: new D1EntitlementReader(env.DB),
        signedUrlGenerator: new R2SignedUrlGenerator(env.PAID_CONTENT, bucketPublicUrl),
        checkContentExists: createContentExistsChecker(env.PAID_CONTENT)
      }
    )

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'

    if (message === 'access denied' || message === 'entitlement not found' || message === 'entitlement is not active') {
      return new Response(
        JSON.stringify({ error: 'access denied' }),
        { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    if (message === 'content not found') {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
