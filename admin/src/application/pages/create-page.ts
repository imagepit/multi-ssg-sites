import type { PageMeta } from '../../domain/pages/page-meta.js'
import { createPageMeta } from '../../domain/pages/page-meta.js'
import type { PageMetaWriteRepository } from './page-meta-write-repository.js'

export type PageInput = {
  siteId: string
  path: string
  slug: string
  title: string
  status?: PageMeta['status']
  tags?: string[]
  priority?: number
  updatedAt?: string
  metadata?: Record<string, unknown>
}

export async function createPage(input: PageInput, repo: PageMetaWriteRepository): Promise<PageMeta> {
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  const page = createPageMeta(input, input.siteId)
  await repo.create(input.siteId, page)
  return page
}
