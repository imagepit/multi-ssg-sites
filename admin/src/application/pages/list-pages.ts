import type { PageMeta } from '../../domain/pages/page-meta.js'
import type { PageMetaReadRepository } from './page-meta-read-repository.js'

export async function listPages(
  siteId: string,
  repo: PageMetaReadRepository,
  options?: { limit?: number; offset?: number }
): Promise<PageMeta[]> {
  if (!siteId) {
    throw new Error('siteId is required')
  }
  return repo.listBySite(siteId, options)
}
