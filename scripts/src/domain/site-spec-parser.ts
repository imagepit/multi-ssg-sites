import { SitePhase } from './value-objects/site-phase.js'

export type SiteSpecData = {
  phase?: string
  theme_id?: string
  themeId?: string
  tech_keyword_id?: string
  site_name?: string
}

export type ParsedSiteSpec = {
  phase: SitePhase
  themeId?: string
  techKeywordId?: string
  siteName?: string
}

export const parseSiteSpec = (data: SiteSpecData): ParsedSiteSpec => {
  return {
    phase: SitePhase.create(data.phase ?? 'unknown'),
    themeId: data.theme_id ?? data.themeId,
    techKeywordId: data.tech_keyword_id,
    siteName: data.site_name
  }
}
