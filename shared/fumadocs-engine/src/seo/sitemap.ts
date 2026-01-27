/**
 * Page information for sitemap generation
 */
export interface SitemapPage {
  /** Page URL path (e.g., '/docs/getting-started') */
  url: string
  /** Last modification date */
  lastModified?: Date | string
}

/**
 * Sitemap entry (compatible with Next.js MetadataRoute.Sitemap)
 */
export interface SitemapEntry {
  url: string
  lastModified?: Date | string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/**
 * Generate sitemap configuration for Next.js
 * @param siteOrigin - The site origin URL (e.g., 'https://example.com')
 * @param pages - Array of pages to include in the sitemap
 * @returns Array of SitemapEntry compatible with Next.js MetadataRoute.Sitemap
 */
export function generateSitemap(
  siteOrigin: string,
  pages: SitemapPage[]
): SitemapEntry[] {
  return pages.map((page) => ({
    url: `${siteOrigin}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: 'weekly' as const,
    priority: page.url === '/' ? 1 : 0.8,
  }))
}
