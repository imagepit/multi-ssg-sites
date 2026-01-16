import fs from 'node:fs'
import path from 'node:path'

export type ThemeConfig = {
  colors?: {
    primary?: string
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
  navigation?: {
    sidebar_mode?: 'sitemap' | 'auto' | 'none'
  }
  [key: string]: unknown
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
  [key: string]: unknown
}

type SpecCacheKey = string
const specCache = new Map<SpecCacheKey, SiteSpec | null>()

function resolveSpecPath(opts?: { siteId?: string | null; rootDir?: string | null }) {
  const siteId = opts?.siteId || process.env.SITE_ID || null
  const rootDir = opts?.rootDir || process.cwd()
  if (siteId) {
    return path.resolve(rootDir, '..', '..', 'contents', siteId, 'specs', 'spec.json')
  }
  return path.join(rootDir, 'specs', 'spec.json')
}

export function readSiteSpec(opts?: { siteId?: string | null; rootDir?: string | null; cache?: boolean }): SiteSpec | null {
  const specPath = resolveSpecPath(opts)
  const cacheKey = `${specPath}`
  if (opts?.cache !== false && specCache.has(cacheKey)) {
    return specCache.get(cacheKey) ?? null
  }

  try {
    const raw = fs.readFileSync(specPath, 'utf8')
    const parsed = JSON.parse(raw) as SiteSpec
    if (opts?.cache !== false) {
      specCache.set(cacheKey, parsed)
    }
    return parsed
  } catch {
    if (opts?.cache !== false) specCache.set(cacheKey, null)
    return null
  }
}

export function getThemePrimary(opts?: { siteId?: string | null; rootDir?: string | null }) {
  const spec = readSiteSpec(opts)
  return spec?.theme_config?.colors?.primary ?? null
}

export function getBranding(opts?: { siteId?: string | null; rootDir?: string | null }) {
  const spec = readSiteSpec(opts)
  return {
    logo: spec?.theme_config?.branding?.logo ?? null,
    favicon: spec?.theme_config?.branding?.favicon ?? null,
    ogImage: spec?.theme_config?.branding?.og_image ?? null,
  }
}

export function getSiteLanguage(opts?: { siteId?: string | null; rootDir?: string | null }) {
  const spec = readSiteSpec(opts)
  return spec?.language ?? null
}

export function getSiteName(opts?: { siteId?: string | null; rootDir?: string | null }) {
  const spec = readSiteSpec(opts)
  return spec?.site_name ?? null
}

export function getSidebarMode(opts?: { siteId?: string | null; rootDir?: string | null; fallback?: 'sitemap' | 'auto' | 'none' }) {
  const spec = readSiteSpec(opts)
  return (spec?.theme_config?.navigation?.sidebar_mode as 'sitemap' | 'auto' | 'none' | undefined) ?? opts?.fallback ?? 'sitemap'
}
