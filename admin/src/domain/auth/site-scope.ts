export function canAccessSite(allowedSiteIds: string[] | undefined, siteId: string): boolean {
  if (!siteId) {
    return false
  }
  if (!allowedSiteIds || allowedSiteIds.length === 0) {
    return false
  }
  return allowedSiteIds.includes(siteId)
}
