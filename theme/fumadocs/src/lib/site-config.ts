import fs from 'node:fs'
import path from 'node:path'

type ThemeConfig = {
  colors: {
    primary: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
    text?: string
    muted?: string
  }
  fonts?: {
    heading?: string
    body?: string
    mono?: string
  }
  branding?: {
    logo?: string
    favicon?: string
    og_image?: string
  }
}

export type SiteSpec = {
  tech_keyword_id?: string
  site_name?: string
  site_type?: string
  language?: string
  created_at?: string
  updated_at?: string
  phase?: string
  theme_config?: ThemeConfig
  seo_strategy?: unknown
  monetization_strategy?: unknown
}

let cachedSpec: SiteSpec | null = null

export function readSiteSpec(): SiteSpec | null {
  if (cachedSpec) return cachedSpec
  const siteId = process.env.SITE_ID
  const specPath = siteId
    ? path.resolve(process.cwd(), '..', '..', 'contents', siteId, 'specs', 'spec.json')
    : path.join(process.cwd(), 'specs', 'spec.json')
  try {
    const raw = fs.readFileSync(specPath, 'utf8')
    const parsed = JSON.parse(raw) as SiteSpec
    cachedSpec = parsed
    return parsed
  } catch {
    return null
  }
}

export function getThemePrimary(): string | null {
  const spec = readSiteSpec()
  return spec?.theme_config?.colors?.primary ?? null
}

export function getBranding() {
  const spec = readSiteSpec()
  return {
    logo: spec?.theme_config?.branding?.logo ?? null,
    favicon: spec?.theme_config?.branding?.favicon ?? null,
    ogImage: spec?.theme_config?.branding?.og_image ?? null,
  }
}

export function getSiteLanguage(): string | null {
  const spec = readSiteSpec()
  return spec?.language ?? null
}

export function getSiteName(): string | null {
  const spec = readSiteSpec()
  return spec?.site_name ?? null
}


