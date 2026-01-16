import type { PageMeta } from '../../domain/pages/page-meta.js'

export interface PageMetaRepository {
  upsertMany(siteId: string, pages: PageMeta[]): Promise<number>
  archiveMissing(siteId: string, activePaths: string[]): Promise<number>
}
