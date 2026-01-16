export type SiteStatus = 'active' | 'disabled'

export interface Site {
  siteId: string
  name: string
  domain?: string
  themeId?: string
  status: SiteStatus
  updatedAt: string
}

interface SiteInput {
  siteId: string
  name: string
  domain?: string
  themeId?: string
  status?: SiteStatus
  updatedAt?: string
}

export function createSite(input: SiteInput): Site {
  if (!input.siteId) {
    throw new Error('siteId is required')
  }
  if (!input.name) {
    throw new Error('name is required')
  }
  return {
    siteId: input.siteId,
    name: input.name,
    domain: input.domain,
    themeId: input.themeId,
    status: input.status ?? 'active',
    updatedAt: input.updatedAt ?? new Date().toISOString()
  }
}
