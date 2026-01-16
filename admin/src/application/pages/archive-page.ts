import type { PageMetaWriteRepository } from './page-meta-write-repository.js'

export async function archivePage(siteId: string, path: string, repo: PageMetaWriteRepository): Promise<void> {
  if (!siteId) {
    throw new Error('siteId is required')
  }
  if (!path) {
    throw new Error('path is required')
  }
  await repo.archive(siteId, path)
}
