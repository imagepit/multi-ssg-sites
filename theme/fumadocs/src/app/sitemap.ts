import type { MetadataRoute } from 'next'
import { generateSitemap } from '@techdoc/fumadocs-engine'
import { source } from '@/lib/source'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000'
  const pages = source.getPages().map((page) => ({
    url: page.url,
  }))
  return generateSitemap(siteOrigin, pages)
}
