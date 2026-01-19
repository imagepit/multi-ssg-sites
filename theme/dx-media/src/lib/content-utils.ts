export type PageLike = {
  url: string
  data: Record<string, unknown>
}

const isDev = process.env.NODE_ENV === 'development'
const excludedIndexUrls = new Set(['/llms-full.txt', '/tags'])
export const fallbackCover = '/brand/logos/nextjs.svg'

const toTrimmedString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const toStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => toTrimmedString(item))
      .filter((item): item is string => Boolean(item))
  }
  const single = toTrimmedString(value)
  return single ? [single] : []
}

export const getCategoryList = (data: Record<string, unknown>): string[] => {
  const categories = toStringList(data.categories)
  if (categories.length > 0) return categories
  return toStringList(data.category)
}

export const getPrimaryCategory = (data: Record<string, unknown>): string | null => {
  return getCategoryList(data)[0] ?? null
}

export const getTagList = (data: Record<string, unknown>): string[] => {
  return toStringList(data.tags)
}

export const isPageVisible = (data: Record<string, unknown>): boolean => {
  if (isDev) return true
  return data.status === 'publish'
}

export const filterIndexPages = <T extends PageLike>(pages: T[]): T[] => {
  return pages.filter((page) => isPageVisible(page.data) && !excludedIndexUrls.has(page.url))
}

export const byDateDesc = (a: PageLike, b: PageLike): number => {
  const aValue = typeof a.data.date === 'string' ? Date.parse(a.data.date) : 0
  const bValue = typeof b.data.date === 'string' ? Date.parse(b.data.date) : 0
  return bValue - aValue
}

export const formatDate = (input?: string | null): string => {
  if (!input) return ''
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export const groupByCategory = <T extends PageLike>(pages: T[]): Map<string, T[]> => {
  const groups = new Map<string, T[]>()
  for (const page of pages) {
    const label = getPrimaryCategory(page.data) ?? 'Other'
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(page)
  }
  return groups
}

export const getCategoryHref = (category: string): string => {
  return `/categories/${category}`
}

export const hasCategory = (data: Record<string, unknown>, category: string): boolean => {
  return getCategoryList(data).includes(category)
}

export const normalizeCategoryParam = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

export const getRelatedPages = <T extends PageLike>(
  pages: T[],
  current: T,
  limit = 6,
): T[] => {
  const category = getPrimaryCategory(current.data)
  if (!category) return []

  const currentTags = new Set(getTagList(current.data))
  const candidates = pages.filter((page) => page.url !== current.url && hasCategory(page.data, category))

  return candidates
    .map((page) => {
      const tags = getTagList(page.data)
      const tagMatch = tags.some((tag) => currentTags.has(tag))
      return { page, tagMatch }
    })
    .sort((a, b) => {
      if (a.tagMatch !== b.tagMatch) return a.tagMatch ? -1 : 1
      return byDateDesc(a.page, b.page)
    })
    .map((item) => item.page)
    .slice(0, limit)
}

const normalizeCoverUrl = (input: string): string | null => {
  const trimmed = input.trim().replace(/^<|>$/g, '').replace(/^['"]|['"]$/g, '')
  const withoutHash = trimmed.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  if (!withoutQuery) return null
  if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) return withoutQuery
  if (withoutQuery.startsWith('/')) return withoutQuery
  const idx = withoutQuery.indexOf('images/')
  if (idx >= 0) return `/${withoutQuery.slice(idx)}`
  return withoutQuery
}

const deriveCoverFromBody = async (page: PageLike): Promise<string | null> => {
  const raw = await (page.data as any)?.getText?.('raw')
  if (!raw || typeof raw !== 'string') return null

  const md = raw.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/m)
  if (md?.[1]) return normalizeCoverUrl(md[1])

  const html = raw.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (html?.[1]) return normalizeCoverUrl(html[1])

  return null
}

export const resolvePageCover = async (page: PageLike): Promise<string> => {
  const data = page.data as Record<string, unknown>
  if (typeof data.cover === 'string' && data.cover.trim().length > 0) return data.cover
  return (await deriveCoverFromBody(page)) ?? fallbackCover
}
