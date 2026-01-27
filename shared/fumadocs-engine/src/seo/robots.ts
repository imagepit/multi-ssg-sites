/**
 * Robots.txt rule configuration
 */
export interface RobotsRule {
  userAgent: string | string[]
  allow?: string | string[]
  disallow?: string | string[]
  crawlDelay?: number
}

/**
 * Robots.txt configuration (compatible with Next.js MetadataRoute.Robots)
 */
export interface RobotsConfig {
  rules: RobotsRule | RobotsRule[]
  sitemap?: string | string[]
  host?: string
}

/**
 * Generate robots.txt configuration for Next.js
 * @param siteOrigin - The site origin URL (e.g., 'https://example.com')
 * @returns RobotsConfig object compatible with Next.js MetadataRoute.Robots
 */
export function generateRobots(siteOrigin: string): RobotsConfig {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  }
}
