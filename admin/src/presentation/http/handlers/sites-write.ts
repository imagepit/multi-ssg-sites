import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { requireRole } from '../middleware/authorization.js'
import { createSite } from '../../../application/sites/create-site.js'
import { updateSite } from '../../../application/sites/update-site.js'
import { disableSite } from '../../../application/sites/disable-site.js'
import { D1SiteWriter } from '../../../infrastructure/db/d1-site-writer.js'

export async function handleSitesWrite(
  request: Request,
  env: Env,
  claims: AuthClaims
): Promise<Response> {
  const roleCheck = requireRole(claims, 'admin')
  if (roleCheck) {
    return roleCheck
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const writer = new D1SiteWriter(env.DB)

  if (request.method === 'POST' || request.method === 'PATCH') {
    const body = await parseJson(request)
    if (!body) {
      return new Response('Invalid JSON', { status: 400 })
    }

    try {
      const input = normalizeSiteInput(body)
      const site = request.method === 'POST'
        ? await createSite(input, writer)
        : await updateSite(input, writer)
      return new Response(JSON.stringify({ site }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    } catch (error) {
      return mapSiteError(error)
    }
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url)
    const siteId = url.searchParams.get('site_id') ?? url.searchParams.get('siteId')
    try {
      await disableSite(siteId ?? '', writer)
      return new Response(JSON.stringify({ siteId }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    } catch (error) {
      return mapSiteError(error)
    }
  }

  return new Response('Method Not Allowed', { status: 405 })
}

async function parseJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value = await request.json()
    if (!isRecord(value)) {
      return null
    }
    return value
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeSiteInput(body: Record<string, unknown>) {
  const { siteId, name, domain, themeId, status } = body
  return {
    siteId: valueToString(siteId),
    name: valueToString(name),
    domain: typeof domain === 'string' ? domain : undefined,
    themeId: typeof themeId === 'string' ? themeId : undefined,
    status: status as 'active' | 'disabled'
  }
}

function valueToString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return ''
}

function mapSiteError(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'error'
  if (message === 'site exists') {
    return new Response('Conflict', { status: 409 })
  }
  if (message === 'site not found') {
    return new Response('Not Found', { status: 404 })
  }
  if (message === 'siteId is required' || message === 'name is required') {
    return new Response(message, { status: 400 })
  }
  return new Response('Bad Request', { status: 400 })
}
