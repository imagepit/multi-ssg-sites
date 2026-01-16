import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { listPages } from '../../../application/pages/list-pages.js'
import { resolveSiteByHost } from '../../../application/sites/resolve-site-by-host.js'
import { D1PageMetaReader } from '../../../infrastructure/db/d1-page-meta-reader.js'
import { D1SiteHostReader } from '../../../infrastructure/db/d1-site-host-reader.js'
import { requireSiteScope } from '../middleware/authorization.js'

export async function handlePages(request: Request, env: Env, claims: AuthClaims): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const url = new URL(request.url)
  const headerSiteId = request.headers.get('X-Site-Id')
  const querySiteId = url.searchParams.get('site_id') ?? url.searchParams.get('siteId')
  let siteId = headerSiteId ?? querySiteId
  if (!siteId) {
    const host = getRequestHost(request)
    if (host) {
      const resolved = await resolveSiteByHost(host, new D1SiteHostReader(env.DB))
      siteId = resolved?.siteId ?? null
      if (!siteId) {
        return new Response('site not found', { status: 404 })
      }
    }
  }
  const scopeCheck = requireSiteScope(claims, siteId)
  if (scopeCheck) {
    return scopeCheck
  }

  const limit = parseNumber(url.searchParams.get('limit'))
  const offset = parseNumber(url.searchParams.get('offset'))

  const pages = await listPages(siteId ?? '', new D1PageMetaReader(env.DB), { limit, offset })
  return new Response(JSON.stringify({ pages }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

function parseNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function getRequestHost(request: Request): string | null {
  return request.headers.get('X-Forwarded-Host') ?? request.headers.get('Host')
}
