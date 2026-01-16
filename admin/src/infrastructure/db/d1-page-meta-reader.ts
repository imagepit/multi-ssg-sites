import type { PageMetaReadRepository } from '../../application/pages/page-meta-read-repository.js'
import type { PageMeta } from '../../domain/pages/page-meta.js'

export class D1PageMetaReader implements PageMetaReadRepository {
  constructor(private readonly db: D1Database) {}

  async listBySite(
    siteId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<PageMeta[]> {
    const limit = Math.min(Math.max(options?.limit ?? 100, 1), 500)
    const offset = Math.max(options?.offset ?? 0, 0)
    const result = await this.db
      .prepare(
        'SELECT site_id as siteId, path, slug, title, status, tags, priority, updated_at as updatedAt, metadata_json as metadata ' +
          'FROM pages_meta WHERE site_id = ? ORDER BY path LIMIT ? OFFSET ?'
      )
      .bind(siteId, limit, offset)
      .all<PageMeta>()

    return (result.results ?? []).map((row) => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags ?? undefined,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata ?? undefined
    }))
  }
}
