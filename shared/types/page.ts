export type PageStatus = 'draft' | 'published' | 'archived'

export interface PageMeta {
  id: string
  siteId: string
  path: string
  slug: string
  title: string
  status: PageStatus
  tags?: string[]
  priority?: number
  createdAt?: string
  updatedAt?: string
}
