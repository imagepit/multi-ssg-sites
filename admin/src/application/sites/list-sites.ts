import type { Site } from '../../domain/sites/site.js'
import type { SiteReadRepository } from './site-read-repository.js'

export async function listSites(siteIds: string[], repo: SiteReadRepository): Promise<Site[]> {
  if (!siteIds || siteIds.length === 0) {
    throw new Error('siteIds are required')
  }
  return repo.listByIds(siteIds)
}
