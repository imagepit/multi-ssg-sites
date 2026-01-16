import type { PageMeta } from '../../domain/pages/page-meta.js'

export interface PageMetaReadRepository {
  listBySite(siteId: string, options?: { limit?: number; offset?: number }): Promise<PageMeta[]>
}
