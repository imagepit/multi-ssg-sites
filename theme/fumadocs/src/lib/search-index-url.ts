export const getSearchIndexUrl = (siteId: string): string => {
  const base = process.env.NEXT_PUBLIC_SEARCH_INDEX_BASE_URL
  if (base && base.length > 0) {
    return `${base.replace(/\/$/, '')}/search-indexes/${siteId}.json`
  }
  return `/search-indexes/${siteId}.json`
}
