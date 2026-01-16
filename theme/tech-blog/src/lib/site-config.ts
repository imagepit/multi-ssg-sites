import fs from 'node:fs'
import path from 'node:path'

type ThemeConfig = {
  colors?: Record<string, string>
  branding?: { logo?: string; favicon?: string; og_image?: string }
}

export type SiteSpec = {
  site_name?: string
  language?: string
  theme_config?: ThemeConfig
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

export function getSiteName(): string {
  return readSiteSpec()?.site_name || 'Tech Blog'
}

export function getBranding() {
  const spec = readSiteSpec()
  return {
    logo: spec?.theme_config?.branding?.logo ?? null,
    favicon: spec?.theme_config?.branding?.favicon ?? null,
    ogImage: spec?.theme_config?.branding?.og_image ?? null,
  }
}

