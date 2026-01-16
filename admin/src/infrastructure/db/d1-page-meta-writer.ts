import type { PageMetaWriteRepository } from '../../application/pages/page-meta-write-repository.js'
import type { PageMeta } from '../../domain/pages/page-meta.js'

export class D1PageMetaWriter implements PageMetaWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(siteId: string, page: PageMeta): Promise<void> {
    const exists = await this.db
      .prepare('SELECT id FROM pages_meta WHERE site_id = ? AND path = ?')
      .bind(siteId, page.path)
      .first()
    if (exists) {
      throw new Error('page exists')
    }
    await this.db
      .prepare(
        'INSERT INTO pages_meta (site_id, path, slug, title, status, tags, priority, updated_at, metadata_json) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      .run()
  }

  async update(siteId: string, page: PageMeta): Promise<void> {
    const exists = await this.db
      .prepare('SELECT id FROM pages_meta WHERE site_id = ? AND path = ?')
      .bind(siteId, page.path)
      .first()
    if (!exists) {
      throw new Error('page not found')
    }
    await this.db
      .prepare(
        'UPDATE pages_meta SET slug = ?, title = ?, status = ?, tags = ?, priority = ?, updated_at = ?, metadata_json = ? ' +
          'WHERE site_id = ? AND path = ?'
      )
      .bind(
        page.slug,
        page.title,
        page.status,
        page.tags ? JSON.stringify(page.tags) : null,
        page.priority ?? null,
        page.updatedAt,
        page.metadata ? JSON.stringify(page.metadata) : null,
        siteId,
        page.path
      )
      .run()
  }

  async archive(siteId: string, path: string): Promise<void> {
    const result = await this.db
      .prepare('UPDATE pages_meta SET status = ?, updated_at = ? WHERE site_id = ? AND path = ?')
      .bind('archived', new Date().toISOString(), siteId, path)
      .run()
    if ((result.meta.changes ?? 0) === 0) {
      throw new Error('page not found')
    }
  }
}
