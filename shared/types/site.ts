export type SiteStatus = 'active' | 'disabled'

export interface Site {
  id: string
  name: string
  domain: string
  status: SiteStatus
  themeId?: string
  createdAt?: string
  updatedAt?: string
}
