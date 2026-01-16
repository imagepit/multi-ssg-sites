import type { Env } from '../../env.js'
import type { AuthDependencies } from './middleware/authentication.js'
import type { AuditLogger } from '../../application/audit/audit-logger.js'
import { healthHandler } from './handlers/health.js'
import { handleSync } from './handlers/sync.js'
import { handleSites } from './handlers/sites.js'
import { handlePages } from './handlers/pages.js'
import { handleSitesWrite } from './handlers/sites-write.js'
import { handlePagesWrite } from './handlers/pages-write.js'
import { whoamiHandler } from './handlers/whoami.js'
import { applyCors } from './middleware/cors.js'
import { requireAuth } from './middleware/authentication.js'
import { requireRole, requireSiteScope } from './middleware/authorization.js'
import { logAudit } from '../../application/audit/log-audit.js'

export async function handleHttpRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  deps: AuthDependencies & { auditLogger: AuditLogger | null }
): Promise<Response> {
  void env
  void ctx

  const origin = request.headers.get('Origin') || undefined
  if (request.method === 'OPTIONS') {
    return applyCors(new Response(null, { status: 204 }), origin)
  }

  const url = new URL(request.url)
  if (url.pathname === '/health') {
    return applyCors(healthHandler(), origin)
  }

  if (url.pathname === '/admin/sync') {
    return applyCors(await handleSync(request, env, deps.auditLogger), origin)
  }

  const auth = await requireAuth(request, deps)
  if (auth instanceof Response) {
    return applyCors(auth, origin)
  }

  const roleCheck = requireRole(auth, 'viewer')
  if (roleCheck) {
    return applyCors(roleCheck, origin)
  }

  if (url.pathname === '/auth/whoami') {
    return applyCors(whoamiHandler(auth), origin)
  }

  if (url.pathname === '/admin/sites') {
    if (request.method === 'GET') {
      return applyCors(await handleSites(request, env, auth), origin)
    }
    return applyCors(await handleSitesWrite(request, env, auth), origin)
  }

  if (url.pathname === '/admin/pages') {
    if (request.method === 'GET') {
      return applyCors(await handlePages(request, env, auth), origin)
    }
    return applyCors(await handlePagesWrite(request, env, auth), origin)
  }

  if (shouldAudit(request) && deps.auditLogger) {
    await logAudit(
      {
        actorId: auth.sub,
        action: actionForMethod(request.method),
        resource: url.pathname,
        siteId: getSiteId(request) ?? undefined,
        metadata: { method: request.method }
      },
      deps.auditLogger
    )
  }

  return applyCors(new Response('Not Found', { status: 404 }), origin)
}

function getSiteId(request: Request): string | null {
  const headerValue = request.headers.get('X-Site-Id')
  if (headerValue) {
    return headerValue
  }
  const url = new URL(request.url)
  return url.searchParams.get('site_id') ?? url.searchParams.get('siteId')
}

function shouldAudit(request: Request): boolean {
  return request.method !== 'GET' && request.method !== 'HEAD'
}

function actionForMethod(method: string): string {
  switch (method) {
    case 'POST':
      return 'create'
    case 'PUT':
    case 'PATCH':
      return 'update'
    case 'DELETE':
      return 'delete'
    default:
      return 'access'
  }
}
