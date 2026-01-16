import { describe, expect, it } from 'vitest'
import { listPages } from '../../src/application/pages/list-pages.js'
import type { PageMetaReadRepository } from '../../src/application/pages/page-meta-read-repository.js'

class FakePageMetaReadRepository implements PageMetaReadRepository {
  constructor(private readonly pages: Array<{ path: string }>) {}

  async listBySite(siteId: string): Promise<Array<{ path: string }>> {
    if (siteId === 'nextjs') {
      return this.pages
    }
    return []
  }
}

describe('listPages', () => {
  it('returns pages for a site', async () => {
    const repo = new FakePageMetaReadRepository([{ path: '/intro' }])
    const result = await listPages('nextjs', repo)
    expect(result).toEqual([{ path: '/intro' }])
  })

  it('throws when siteId is missing', async () => {
    const repo = new FakePageMetaReadRepository([])
    await expect(listPages('', repo)).rejects.toThrow('siteId is required')
  })
})
