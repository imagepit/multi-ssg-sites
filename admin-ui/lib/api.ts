import type { AdminSettings } from './admin-settings'

function normalizeBaseUrl(value: string): string {
  if (!value) {
    return ''
  }
  return value.endsWith('/') ? value : `${value}/`
}

export async function adminFetch<T>(
  settings: AdminSettings,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const baseUrl = normalizeBaseUrl(settings.baseUrl)
  const target = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(target, baseUrl)
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (settings.token) {
    headers.set('Authorization', `Bearer ${settings.token}`)
  }

  const response = await fetch(url, { ...init, headers })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API request failed: ${response.status} ${text}`)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}
