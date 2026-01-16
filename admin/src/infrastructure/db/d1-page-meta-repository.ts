import type { PageMetaRepository } from '../../application/sync/page-meta-repository.js'
import type { PageMeta } from '../../domain/pages/page-meta.js'

export class D1PageMetaRepository implements PageMetaRepository {
  constructor(private readonly db: D1Database) {}

  async upsertMany(siteId: string, pages: PageMeta[]): Promise<number> {
    if (pages.length === 0) {
      return 0
    }

    const statements = pages.map((page) =>
      this.db
        .prepare(
          'INSERT INTO pages_meta (site_id, path, slug, title, status, tags, priority, updated_at, metadata_json) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
            'ON CONFLICT(site_id, path) DO UPDATE SET ' +
            'slug = excluded.slug, title = excluded.title, status = excluded.status, tags = excluded.tags, ' +
            'priority = excluded.priority, updated_at = excluded.updated_at, metadata_json = excluded.metadata_json'
        )
        .bind(
          siteId,
          page.path,
          page.slug,
          page.title,
          page.status,
          page.tags ? JSON.stringify(page.tags) : null,
          page.priority ?? null,
          page.updatedAt,
          page.metadata ? JSON.stringify(page.metadata) : null
        )
    )

    await this.db.batch(statements)
    return pages.length
  }

  async archiveMissing(siteId: string, activePaths: string[]): Promise<number> {
    const now = new Date().toISOString()
    if (activePaths.length === 0) {
      const result = await this.db
        .prepare('UPDATE pages_meta SET status = ?, updated_at = ? WHERE site_id = ?')
        .bind('archived', now, siteId)
        .run()
      return result.meta.changes ?? 0
    }

    const activeJson = JSON.stringify(activePaths)
    const result = await this.db
      .prepare(
        'UPDATE pages_meta SET status = ?, updated_at = ? WHERE site_id = ? ' +
          'AND path NOT IN (SELECT value FROM json_each(?))'
      )
      .bind('archived', now, siteId, activeJson)
      .run()
    return result.meta.changes ?? 0
  }
}
