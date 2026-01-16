import type { SiteHostRepository } from '../../application/sites/site-host-repository.js'
import type { Site } from '../../domain/sites/site.js'

export class D1SiteHostReader implements SiteHostRepository {
  constructor(private readonly db: D1Database) {}

  async findByHost(hostname: string): Promise<Site | null> {
    const result = await this.db
      .prepare(
        'SELECT site_id as siteId, name, domain, theme_id as themeId, status, updated_at as updatedAt ' +
          'FROM sites WHERE domain IS NOT NULL AND lower(domain) = ? LIMIT 1'
      )
      .bind(hostname.toLowerCase())
      .first<Site>()

    return result ?? null
  }
}
