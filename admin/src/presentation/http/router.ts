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
import { handleAuthRequestLink } from './handlers/auth-request-link.js'
import { handleAuthVerify } from './handlers/auth-verify.js'
import { handleAuthRefresh } from './handlers/auth-refresh.js'
import { handlePaidContent } from './handlers/paid-content.js'
import { handleCheckoutCreate } from './handlers/checkout.js'
import { handleStripeWebhook } from './handlers/stripe-webhook.js'
import { applyCors } from './middleware/cors.js'
import { requireAuth } from './middleware/authentication.js'
import { requireRole } from './middleware/authorization.js'
import { requirePaidContentAuth } from './middleware/paid-content-auth.js'
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

  // Auth endpoints (no authentication required)
  if (url.pathname === '/auth/request_link' && request.method === 'POST') {
    return applyCors(await handleAuthRequestLink(request, env), origin)
  }

  if (url.pathname === '/auth/verify' && request.method === 'GET') {
    return applyCors(await handleAuthVerify(request, env), origin)
  }

  if (url.pathname === '/auth/refresh' && request.method === 'POST') {
    return applyCors(await handleAuthRefresh(request, env), origin)
  }

  // Stripe webhook endpoint (no authentication, uses signature verification)
  if (url.pathname === '/api/stripe/webhook' && request.method === 'POST') {
    return applyCors(await handleStripeWebhook(request, env), origin)
  }

  // Paid content endpoint (uses magic link JWT, no admin role check)
  if (url.pathname === '/api/paid-content' && request.method === 'GET') {
    const paidContentAuth = await requirePaidContentAuth(request, env)
    if (paidContentAuth instanceof Response) {
      return applyCors(paidContentAuth, origin)
    }
    return applyCors(await handlePaidContent(request, env, paidContentAuth), origin)
  }

  // Checkout endpoint (uses magic link JWT, no admin role check)
  if (url.pathname === '/api/checkout/create' && request.method === 'POST') {
    const checkoutAuth = await requirePaidContentAuth(request, env)
    if (checkoutAuth instanceof Response) {
      return applyCors(checkoutAuth, origin)
    }
    return applyCors(await handleCheckoutCreate(request, env, checkoutAuth), origin)
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
