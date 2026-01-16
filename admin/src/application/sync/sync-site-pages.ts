import type { Site } from '../../domain/sites/site.js'
import type { PageMeta } from '../../domain/pages/page-meta.js'
import type { SiteRepository } from './site-repository.js'
import type { PageMetaRepository } from './page-meta-repository.js'
import { createSite } from '../../domain/sites/site.js'
import { createPageMeta } from '../../domain/pages/page-meta.js'

export type SyncMode = 'full'

export interface SyncSiteInput {
  siteId: string
  name: string
  domain?: string
  themeId?: string
  status?: 'active' | 'disabled'
}

export interface SyncPageInput {
  path: string
  slug: string
  title: string
  status?: 'draft' | 'published' | 'archived'
  tags?: string[]
  priority?: number
  updatedAt?: string
  metadata?: Record<string, unknown>
}

export interface SyncRequest {
  site: SyncSiteInput
  pages: SyncPageInput[]
  sync: {
    mode: SyncMode
    sentAt?: string
  }
}

export interface SyncDependencies {
  siteRepository: SiteRepository
  pageRepository: PageMetaRepository
}

export interface SyncResult {
  site: { siteId: string; created: boolean }
  pages: { upserted: number; archived: number }
}

export async function syncSitePages(input: SyncRequest, deps: SyncDependencies): Promise<SyncResult> {
  const site: Site = createSite({
    siteId: input.site.siteId,
    name: input.site.name,
    domain: input.site.domain,
    themeId: input.site.themeId,
    status: input.site.status
  })

  const pages: PageMeta[] = input.pages.map((page) => createPageMeta(page, site.siteId))

  const siteResult = await deps.siteRepository.upsert(site)
  const upserted = await deps.pageRepository.upsertMany(site.siteId, pages)
  const activePaths = pages.map((page) => page.path)
  const archived = await deps.pageRepository.archiveMissing(site.siteId, activePaths)

  return {
    site: { siteId: site.siteId, created: siteResult.created },
    pages: { upserted, archived }
  }
}
