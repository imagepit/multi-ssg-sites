import { describe, expect, it } from 'vitest'
import type { Site } from '../../src/domain/sites/site.js'
import { createSite } from '../../src/domain/sites/site.js'
import { resolveSiteByHost } from '../../src/application/sites/resolve-site-by-host.js'
import type { SiteHostRepository } from '../../src/application/sites/site-host-repository.js'

class FakeSiteHostRepository implements SiteHostRepository {
  public lastHost: string | null = null

  constructor(private readonly site: Site | null) {}

  async findByHost(hostname: string): Promise<Site | null> {
    this.lastHost = hostname
    return this.site
  }
}

describe('resolveSiteByHost', () => {
  it('normalizes host and returns active site', async () => {
    const site = createSite({
      siteId: 'nextjs',
      name: 'Next.js',
      domain: 'example.com',
      status: 'active',
      updatedAt: '2024-01-01T00:00:00.000Z'
    })
    const repo = new FakeSiteHostRepository(site)

    const result = await resolveSiteByHost('Example.com:8080', repo)

    expect(repo.lastHost).toBe('example.com')
    expect(result?.siteId).toBe('nextjs')
  })

  it('returns null for disabled site', async () => {
    const site = createSite({
      siteId: 'legacy',
      name: 'Legacy',
      domain: 'legacy.example.com',
      status: 'disabled',
      updatedAt: '2024-01-01T00:00:00.000Z'
    })
    const repo = new FakeSiteHostRepository(site)

    const result = await resolveSiteByHost('legacy.example.com', repo)

    expect(result).toBeNull()
  })

  it('throws when host is missing', async () => {
    const repo = new FakeSiteHostRepository(null)

    await expect(resolveSiteByHost('  ', repo)).rejects.toThrow('host is required')
  })
})
