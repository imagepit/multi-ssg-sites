import type { Site } from '../../domain/sites/site.js'
import { createSite as buildSite } from '../../domain/sites/site.js'
import type { SiteWriteRepository } from './site-write-repository.js'

export type SiteInput = {
  siteId: string
  name: string
  domain?: string
  themeId?: string
  status?: Site['status']
}

export async function createSite(input: SiteInput, repo: SiteWriteRepository): Promise<Site> {
  const site = buildSite(input)
  await repo.create(site)
  return site
}
