import type { Site } from '../../domain/sites/site.js'

export interface SiteWriteRepository {
  create(site: Site): Promise<void>
  update(site: Site): Promise<void>
  disable(siteId: string): Promise<void>
}
