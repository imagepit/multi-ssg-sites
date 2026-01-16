import { describe, expect, it } from 'vitest'
import type { SiteWriteRepository } from '../../src/application/sites/site-write-repository.js'
import { createSite } from '../../src/application/sites/create-site.js'
import { updateSite } from '../../src/application/sites/update-site.js'
import { disableSite } from '../../src/application/sites/disable-site.js'

class FakeSiteWriteRepository implements SiteWriteRepository {
  public created = false
  public updated = false
  public disabled = false
  public lastSiteId: string | null = null

  async create(site: { siteId: string }): Promise<void> {
    this.created = true
    this.lastSiteId = site.siteId
  }

  async update(site: { siteId: string }): Promise<void> {
    this.updated = true
    this.lastSiteId = site.siteId
  }

  async disable(siteId: string): Promise<void> {
    this.disabled = true
    this.lastSiteId = siteId
  }
}

describe('site write usecases', () => {
  it('creates a site', async () => {
    const repo = new FakeSiteWriteRepository()
    await createSite({ siteId: 'nextjs', name: 'Next.js' }, repo)
    expect(repo.created).toBe(true)
    expect(repo.lastSiteId).toBe('nextjs')
  })

  it('updates a site', async () => {
    const repo = new FakeSiteWriteRepository()
    await updateSite({ siteId: 'nextjs', name: 'Next.js' }, repo)
    expect(repo.updated).toBe(true)
  })

  it('disables a site', async () => {
    const repo = new FakeSiteWriteRepository()
    await disableSite('nextjs', repo)
    expect(repo.disabled).toBe(true)
  })
})
