const STORAGE_KEY = 'techdoc-admin-ui-site'

export function loadSelectedSite(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.localStorage.getItem(STORAGE_KEY) || ''
}

export function saveSelectedSite(siteId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, siteId)
}
