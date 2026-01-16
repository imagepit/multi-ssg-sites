import { describe, expect, it } from 'vitest'
import { listSites } from '../../src/application/sites/list-sites.js'
import type { SiteReadRepository } from '../../src/application/sites/site-read-repository.js'

class FakeSiteReadRepository implements SiteReadRepository {
  constructor(private readonly sites: Array<{ siteId: string }>) {}

  async listByIds(siteIds: string[]): Promise<Array<{ siteId: string }>> {
    return this.sites.filter((site) => siteIds.includes(site.siteId))
  }
}

describe('listSites', () => {
  it('returns sites for allowed siteIds', async () => {
    const repo = new FakeSiteReadRepository([{ siteId: 'nextjs' }, { siteId: 'v0' }])
    const result = await listSites(['nextjs'], repo)
    expect(result).toEqual([{ siteId: 'nextjs' }])
  })

  it('throws when siteIds is empty', async () => {
    const repo = new FakeSiteReadRepository([{ siteId: 'nextjs' }])
    await expect(listSites([], repo)).rejects.toThrow('siteIds are required')
  })
})
