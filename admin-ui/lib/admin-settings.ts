export type AdminSettings = {
  baseUrl: string
  token: string
}

const STORAGE_KEY = 'techdoc-admin-ui-settings'

export function defaultSettings(): AdminSettings {
  return {
    baseUrl: process.env.NEXT_PUBLIC_ADMIN_APP_BASE_URL || 'http://localhost:8787',
    token: process.env.NEXT_PUBLIC_ADMIN_JWT || '',
  }
}

export function loadSettings(): AdminSettings {
  if (typeof window === 'undefined') {
    return defaultSettings()
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultSettings()
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AdminSettings>
    return {
      baseUrl: parsed.baseUrl || defaultSettings().baseUrl,
      token: parsed.token || defaultSettings().token,
    }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(settings: AdminSettings): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
