import type { Site } from '../../domain/sites/site.js'

export interface SiteRepository {
  upsert(site: Site): Promise<{ created: boolean }>
}
