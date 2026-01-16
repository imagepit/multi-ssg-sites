import type { Env } from '../../../env.js'
import type { AuthClaims } from '../../../domain/auth/claims.js'
import { requireRole, requireSiteScope } from '../middleware/authorization.js'
import { createPage } from '../../../application/pages/create-page.js'
import { updatePage } from '../../../application/pages/update-page.js'
import { archivePage } from '../../../application/pages/archive-page.js'
import { D1PageMetaWriter } from '../../../infrastructure/db/d1-page-meta-writer.js'

export async function handlePagesWrite(
  request: Request,
  env: Env,
  claims: AuthClaims
): Promise<Response> {
  const roleCheck = requireRole(claims, 'editor')
  if (roleCheck) {
    return roleCheck
  }

  if (!env.DB) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const writer = new D1PageMetaWriter(env.DB)

  if (request.method === 'POST' || request.method === 'PATCH') {
    const body = await parseJson(request)
    if (!body) {
      return new Response('Invalid JSON', { status: 400 })
    }
    const siteId = valueToString(body.siteId)
    const scopeCheck = requireSiteScope(claims, siteId)
    if (scopeCheck) {
      return scopeCheck
    }

    const input = normalizePageInput(body)
    try {
      const page = request.method === 'POST'
        ? await createPage(input, writer)
        : await updatePage(input, writer)
      return new Response(JSON.stringify({ page }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    } catch (error) {
      return mapPageError(error)
    }
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url)
    const siteId = url.searchParams.get('site_id') ?? url.searchParams.get('siteId')
    const scopeCheck = requireSiteScope(claims, siteId)
    if (scopeCheck) {
      return scopeCheck
    }
    const path = url.searchParams.get('path')
    try {
      await archivePage(siteId ?? '', path ?? '', writer)
      return new Response(JSON.stringify({ siteId, path }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    } catch (error) {
      return mapPageError(error)
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

function normalizePageInput(body: Record<string, unknown>) {
  const {
    siteId,
    path,
    slug,
    title,
    status,
    tags,
    priority,
    updatedAt,
    updated_at,
    ...rest
  } = body

  const metadata = Object.keys(rest).length > 0 ? rest : undefined

  return {
    siteId: valueToString(siteId),
    path: valueToString(path),
    slug: valueToString(slug),
    title: valueToString(title),
    status: status as 'draft' | 'published' | 'archived',
    tags: Array.isArray(tags) ? tags.map((item) => String(item)) : undefined,
    priority: typeof priority === 'number' ? priority : undefined,
    updatedAt: typeof updatedAt === 'string' ? updatedAt : typeof updated_at === 'string' ? updated_at : undefined,
    metadata
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
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

function mapPageError(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'error'
  if (message === 'page exists') {
    return new Response('Conflict', { status: 409 })
  }
  if (message === 'page not found') {
    return new Response('Not Found', { status: 404 })
  }
  if (message === 'siteId is required' || message === 'path is required') {
    return new Response(message, { status: 400 })
  }
  return new Response('Bad Request', { status: 400 })
}
