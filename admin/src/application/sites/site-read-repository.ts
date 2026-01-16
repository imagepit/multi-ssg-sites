import type { Site } from '../../domain/sites/site.js'

export interface SiteReadRepository {
  listByIds(siteIds: string[]): Promise<Site[]>
}
