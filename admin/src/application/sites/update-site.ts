import type { Site } from '../../domain/sites/site.js'
import { createSite as buildSite } from '../../domain/sites/site.js'
import type { SiteWriteRepository } from './site-write-repository.js'
import type { SiteInput } from './create-site.js'

export async function updateSite(input: SiteInput, repo: SiteWriteRepository): Promise<Site> {
  const site = buildSite(input)
  await repo.update(site)
  return site
}
