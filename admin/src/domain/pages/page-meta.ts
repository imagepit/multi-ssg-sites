export type PageStatus = 'draft' | 'published' | 'archived'

export interface PageMeta {
  siteId: string
  path: string
  slug: string
  title: string
  status: PageStatus
  tags?: string[]
  priority?: number
  updatedAt: string
  metadata?: Record<string, unknown>
}

interface PageMetaInput {
  path: string
  slug: string
  title: string
  status?: PageStatus
  tags?: string[]
  priority?: number
  updatedAt?: string
  metadata?: Record<string, unknown>
}

export function createPageMeta(input: PageMetaInput, siteId: string): PageMeta {
  if (!siteId) {
    throw new Error('siteId is required')
  }
  if (!input.path) {
    throw new Error('path is required')
  }
  if (!input.slug) {
    throw new Error('slug is required')
  }
  if (!input.title) {
    throw new Error('title is required')
  }

  const normalizedPath = input.path.startsWith('/') ? input.path : `/${input.path}`

  return {
    siteId,
    path: normalizedPath,
    slug: input.slug,
    title: input.title,
    status: normalizeStatus(input.status),
    tags: input.tags,
    priority: input.priority,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
    metadata: input.metadata
  }
}

function normalizeStatus(status?: string): PageStatus {
  if (!status) {
    return 'published'
  }
  if (status === 'publish' || status === 'published') {
    return 'published'
  }
  if (status === 'draft') {
    return 'draft'
  }
  if (status === 'archived') {
    return 'archived'
  }
  return 'draft'
}
