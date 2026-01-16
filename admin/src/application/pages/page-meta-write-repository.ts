import type { PageMeta } from '../../domain/pages/page-meta.js'

export interface PageMetaWriteRepository {
  create(siteId: string, page: PageMeta): Promise<void>
  update(siteId: string, page: PageMeta): Promise<void>
  archive(siteId: string, path: string): Promise<void>
}
