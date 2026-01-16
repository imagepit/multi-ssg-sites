import type { Site } from '../../domain/sites/site.js'

export interface SiteHostRepository {
  findByHost(hostname: string): Promise<Site | null>
}
