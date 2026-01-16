import type { SiteWriteRepository } from '../../application/sites/site-write-repository.js'
import type { Site } from '../../domain/sites/site.js'

export class D1SiteWriter implements SiteWriteRepository {
  constructor(private readonly db: D1Database) {}

  async create(site: Site): Promise<void> {
    const exists = await this.db
      .prepare('SELECT site_id FROM sites WHERE site_id = ?')
      .bind(site.siteId)
      .first()
    if (exists) {
      throw new Error('site exists')
    }
    await this.db
      .prepare(
        'INSERT INTO sites (site_id, name, domain, theme_id, status, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(site.siteId, site.name, site.domain ?? null, site.themeId ?? null, site.status, site.updatedAt)
      .run()
  }

  async update(site: Site): Promise<void> {
    const exists = await this.db
      .prepare('SELECT site_id FROM sites WHERE site_id = ?')
      .bind(site.siteId)
      .first()
    if (!exists) {
      throw new Error('site not found')
    }
    await this.db
      .prepare(
        'UPDATE sites SET name = ?, domain = ?, theme_id = ?, status = ?, updated_at = ? WHERE site_id = ?'
      )
      .bind(site.name, site.domain ?? null, site.themeId ?? null, site.status, site.updatedAt, site.siteId)
      .run()
  }

  async disable(siteId: string): Promise<void> {
    const result = await this.db
      .prepare('UPDATE sites SET status = ?, updated_at = ? WHERE site_id = ?')
      .bind('disabled', new Date().toISOString(), siteId)
      .run()
    if ((result.meta.changes ?? 0) === 0) {
      throw new Error('site not found')
    }
  }
}
