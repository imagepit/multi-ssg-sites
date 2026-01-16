import { describe, expect, it } from 'vitest'
import type { PageMetaWriteRepository } from '../../src/application/pages/page-meta-write-repository.js'
import { createPage } from '../../src/application/pages/create-page.js'
import { updatePage } from '../../src/application/pages/update-page.js'
import { archivePage } from '../../src/application/pages/archive-page.js'

class FakePageMetaWriteRepository implements PageMetaWriteRepository {
  public created = false
  public updated = false
  public archived = false
  public lastPath: string | null = null

  async create(siteId: string, page: { path: string }): Promise<void> {
    this.created = true
    this.lastPath = page.path
  }

  async update(siteId: string, page: { path: string }): Promise<void> {
    this.updated = true
    this.lastPath = page.path
  }

  async archive(siteId: string, path: string): Promise<void> {
    this.archived = true
    this.lastPath = path
  }
}

describe('page write usecases', () => {
  it('creates a page', async () => {
    const repo = new FakePageMetaWriteRepository()
    await createPage(
      {
        siteId: 'nextjs',
        path: '/intro',
        slug: 'intro',
        title: 'Intro'
      },
      repo
    )
    expect(repo.created).toBe(true)
  })

  it('updates a page', async () => {
    const repo = new FakePageMetaWriteRepository()
    await updatePage(
      {
        siteId: 'nextjs',
        path: '/intro',
        slug: 'intro',
        title: 'Intro'
      },
      repo
    )
    expect(repo.updated).toBe(true)
  })

  it('archives a page', async () => {
    const repo = new FakePageMetaWriteRepository()
    await archivePage('nextjs', '/intro', repo)
    expect(repo.archived).toBe(true)
  })
})
