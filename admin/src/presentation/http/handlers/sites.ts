import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { listSites } from '../../../application/sites/list-sites.js'
import { D1SiteReader } from '../../../infrastructure/db/d1-site-reader.js'

export async function handleSites(request: Request, env: Env, claims: AuthClaims): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const siteIds = claims.siteIds ?? []
  if (siteIds.length === 0) {
    return new Response('Forbidden', { status: 403 })
  }

  const sites = await listSites(siteIds, new D1SiteReader(env.DB))
  return new Response(JSON.stringify({ sites }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}
