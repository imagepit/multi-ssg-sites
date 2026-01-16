import type { SiteRepository } from '../../application/sync/site-repository.js'
import type { Site } from '../../domain/sites/site.js'

export class D1SiteRepository implements SiteRepository {
  constructor(private readonly db: D1Database) {}

  async upsert(site: Site): Promise<{ created: boolean }> {
    const existing = await this.db
      .prepare('SELECT site_id FROM sites WHERE site_id = ?')
      .bind(site.siteId)
      .first()

    const now = site.updatedAt
    if (existing) {
      await this.db
        .prepare(
          'UPDATE sites SET name = ?, domain = ?, theme_id = ?, status = ?, updated_at = ? WHERE site_id = ?'
        )
        .bind(site.name, site.domain ?? null, site.themeId ?? null, site.status, now, site.siteId)
        .run()
      return { created: false }
    }

    await this.db
      .prepare(
        'INSERT INTO sites (site_id, name, domain, theme_id, status, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(site.siteId, site.name, site.domain ?? null, site.themeId ?? null, site.status, now)
      .run()

    return { created: true }
  }
}
