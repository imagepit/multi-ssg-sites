import type { Env } from '../../../env.js'
import type { AuditLogger } from '../../../application/audit/audit-logger.js'
import { syncSitePages } from '../../../application/sync/sync-site-pages.js'
import { D1SiteRepository } from '../../../infrastructure/db/d1-site-repository.js'
import { D1PageMetaRepository } from '../../../infrastructure/db/d1-page-meta-repository.js'
import { logAudit } from '../../../application/audit/log-audit.js'

export async function handleSync(
  request: Request,
  env: Env,
  auditLogger?: AuditLogger | null
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = request.headers.get('X-Admin-Api-Key')
  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!isRecord(payload) || !isRecord(payload.site) || !Array.isArray(payload.pages)) {
    return new Response('Invalid payload', { status: 400 })
  }

  let syncRequest: Parameters<typeof syncSitePages>[0]
  try {
    const pages = payload.pages.map((page) => normalizePageInput(page))
    syncRequest = {
      site: normalizeSiteInput(payload.site),
      pages,
      sync: payload.sync as Parameters<typeof syncSitePages>[0]['sync']
    }
  } catch {
    return new Response('Invalid payload', { status: 400 })
  }

  const result = await syncSitePages(syncRequest, {
    siteRepository: new D1SiteRepository(env.DB),
    pageRepository: new D1PageMetaRepository(env.DB)
  })

  if (auditLogger) {
    await logAudit(
      {
        actorId: 'admin-sync',
        action: 'sync',
        resource: 'pages_meta',
        siteId: result.site.siteId,
        metadata: { upserted: result.pages.upserted, archived: result.pages.archived }
      },
      auditLogger
    )
  }

  return new Response(JSON.stringify(result), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}

function normalizePageInput(value: unknown): Parameters<typeof syncSitePages>[0]['pages'][number] {
  if (!isRecord(value)) {
    throw new Error('Invalid page payload')
  }

  const {
    path,
    slug,
    title,
    status,
    tags,
    priority,
    updatedAt,
    updated_at,
    ...rest
  } = value

  const metadata = Object.keys(rest).length > 0 ? rest : undefined

  return {
    path: String(path ?? ''),
    slug: String(slug ?? ''),
    title: String(title ?? ''),
    status: status as Parameters<typeof syncSitePages>[0]['pages'][number]['status'],
    tags: Array.isArray(tags) ? (tags as string[]) : undefined,
    priority: typeof priority === 'number' ? priority : undefined,
    updatedAt: typeof updatedAt === 'string' ? updatedAt : typeof updated_at === 'string' ? updated_at : undefined,
    metadata
  }
}

function normalizeSiteInput(value: unknown): Parameters<typeof syncSitePages>[0]['site'] {
  if (!isRecord(value)) {
    throw new Error('Invalid site payload')
  }

  const { siteId, name, domain, themeId, status } = value
  if (!siteId || !name) {
    throw new Error('siteId and name are required')
  }

  return {
    siteId: String(siteId),
    name: String(name),
    domain: typeof domain === 'string' ? domain : undefined,
    themeId: typeof themeId === 'string' ? themeId : undefined,
    status: status as Parameters<typeof syncSitePages>[0]['site']['status']
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
