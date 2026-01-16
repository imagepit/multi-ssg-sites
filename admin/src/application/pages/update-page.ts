import type { PageMeta } from '../../domain/pages/page-meta.js'
import { createPageMeta } from '../../domain/pages/page-meta.js'
import type { PageMetaWriteRepository } from './page-meta-write-repository.js'
import type { PageInput } from './create-page.js'

export async function updatePage(input: PageInput, repo: PageMetaWriteRepository): Promise<PageMeta> {
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  const page = createPageMeta(input, input.siteId)
  await repo.update(input.siteId, page)
  return page
}
