import type { SiteReadRepository } from '../../application/sites/site-read-repository.js'
import type { Site } from '../../domain/sites/site.js'

export class D1SiteReader implements SiteReadRepository {
  constructor(private readonly db: D1Database) {}

  async listByIds(siteIds: string[]): Promise<Site[]> {
    if (siteIds.length === 0) {
      return []
    }
    const json = JSON.stringify(siteIds)
    const result = await this.db
      .prepare(
        'SELECT site_id as siteId, name, domain, theme_id as themeId, status, updated_at as updatedAt ' +
          'FROM sites WHERE site_id IN (SELECT value FROM json_each(?))'
      )
      .bind(json)
      .all<Site>()
    return result.results ?? []
  }
}
