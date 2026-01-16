import type { SiteWriteRepository } from './site-write-repository.js'

export async function disableSite(siteId: string, repo: SiteWriteRepository): Promise<void> {
  if (!siteId) {
    throw new Error('siteId is required')
  }
  await repo.disable(siteId)
}
