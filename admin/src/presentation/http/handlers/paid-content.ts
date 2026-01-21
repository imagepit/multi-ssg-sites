import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { getPaidContentUrl } from '../../../application/paid-content/get-paid-content-url.js'
import { D1EntitlementReader } from '../../../infrastructure/db/d1-entitlement-reader.js'
import { D1ProductReader } from '../../../infrastructure/db/d1-product-reader.js'
import {
  R2SignedUrlGenerator,
  createContentExistsChecker
} from '../../../infrastructure/r2/r2-signed-url-generator.js'

export async function handlePaidContent(
  request: Request,
  env: Env,
  claims: AuthClaims
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
  const siteId = url.searchParams.get('siteId')
  const slug = url.searchParams.get('slug')
  const sectionId = url.searchParams.get('sectionId')
  const productId = url.searchParams.get('productId')

  if (!siteId || !slug || !sectionId || !productId) {
    return new Response(
      JSON.stringify({ error: 'siteId, slug, sectionId, and productId are required' }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }

  // Get public URL for R2 bucket
  // In production, this should be configured via environment variable
  const bucketPublicUrl = `https://${env.ENV ?? 'dev'}.r2.example.com`

  try {
    const result = await getPaidContentUrl(
      {
        userId: claims.sub,
        siteId,
        slug,
        sectionId,
        productId
      },
      {
        entitlementRepo: new D1EntitlementReader(env.DB),
        productRepo: new D1ProductReader(env.DB),
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

    if (message === 'access denied') {
      return new Response(
        JSON.stringify({ error: 'access denied' }),
        { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    if (message === 'content not found' || message === 'product not found') {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    if (message === 'product is not available') {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 410, headers: { 'content-type': 'application/json; charset=utf-8' } }
      )
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } }
    )
  }
}
