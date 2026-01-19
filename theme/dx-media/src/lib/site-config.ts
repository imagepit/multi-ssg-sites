import {
  getBranding,
  getSiteLanguage,
  getSiteName,
  getThemePrimary,
  readSiteSpec,
  getSidebarMode,
} from '@techdoc/fumadocs-engine'

export type ProfileConfig = {
  name: string | null
  role: string | null
  bio: string | null
  image: string | null
  xUrl: string | null
}

const emptyProfile: ProfileConfig = {
  name: null,
  role: null,
  bio: null,
  image: null,
  xUrl: null,
}

const toOptionalString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function getProfileConfig(opts?: { siteId?: string | null; rootDir?: string | null }): ProfileConfig {
  const spec = readSiteSpec(opts)
  const raw = spec?.theme_config?.profile
  if (!raw || typeof raw !== 'object') return emptyProfile
  const data = raw as Record<string, unknown>
  return {
    name: toOptionalString(data.name),
    role: toOptionalString(data.role),
    bio: toOptionalString(data.bio),
    image: toOptionalString(data.image),
    xUrl: toOptionalString(data.x_url ?? data.xUrl),
  }
}

export {
  getBranding,
  getSiteLanguage,
  getSiteName,
  getThemePrimary,
  readSiteSpec,
  getSidebarMode,
}
