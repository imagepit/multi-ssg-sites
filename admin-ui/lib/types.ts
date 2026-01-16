export type SiteStatus = 'active' | 'disabled'

export type Site = {
  siteId: string
  name: string
  domain?: string | null
  themeId?: string | null
  status: SiteStatus
  updatedAt: string
}

export type PageMeta = {
  siteId: string
  path: string
  slug: string
  title: string
  status: string
  tags?: string[] | null
  priority?: number | null
  updatedAt: string
  metadata?: Record<string, unknown> | null
}
