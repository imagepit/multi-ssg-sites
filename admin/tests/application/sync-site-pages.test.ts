import { describe, expect, it } from 'vitest'
import type { PageMetaRepository } from '../../src/application/sync/page-meta-repository.js'
import type { SiteRepository } from '../../src/application/sync/site-repository.js'
import { syncSitePages } from '../../src/application/sync/sync-site-pages.js'

class FakeSiteRepository implements SiteRepository {
  public siteId: string | null = null
  constructor(private readonly created: boolean) {}

  async upsert(site: { siteId: string }): Promise<{ created: boolean }> {
    this.siteId = site.siteId
    return { created: this.created }
  }
}

class FakePageRepository implements PageMetaRepository {
  public receivedSiteId: string | null = null
  public receivedPaths: string[] = []
  public receivedMetadata: Array<Record<string, unknown> | undefined> = []
  constructor(private readonly upserted: number, private readonly archived: number) {}

  async upsertMany(siteId: string, pages: { path: string }[]): Promise<number> {
    this.receivedSiteId = siteId
    this.receivedPaths = pages.map((page) => page.path)
    this.receivedMetadata = pages.map((page) => (page as { metadata?: Record<string, unknown> }).metadata)
    return this.upserted
  }

  async archiveMissing(siteId: string, activePaths: string[]): Promise<number> {
    this.receivedSiteId = siteId
    this.receivedPaths = activePaths
    return this.archived
  }
}

describe('syncSitePages', () => {
  it('upserts site and pages then archives missing on full sync', async () => {
    const siteRepo = new FakeSiteRepository(true)
    const pageRepo = new FakePageRepository(2, 1)

    const result = await syncSitePages(
      {
        site: { siteId: 'nextjs', name: 'Next.js' },
        pages: [
          { path: '/intro', slug: 'intro', title: 'Intro', metadata: { parent: '' } },
          { path: '/setup', slug: 'setup', title: 'Setup' }
        ],
        sync: { mode: 'full' }
      },
      { siteRepository: siteRepo, pageRepository: pageRepo }
    )

    expect(siteRepo.siteId).toBe('nextjs')
    expect(pageRepo.receivedSiteId).toBe('nextjs')
    expect(pageRepo.receivedPaths).toEqual(['/intro', '/setup'])
    expect(pageRepo.receivedMetadata).toEqual([{ parent: '' }, undefined])
    expect(result).toEqual({
      site: { siteId: 'nextjs', created: true },
      pages: { upserted: 2, archived: 1 }
    })
  })
})
