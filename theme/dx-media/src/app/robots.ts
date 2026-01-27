import type { MetadataRoute } from 'next'
import { generateRobots } from '@techdoc/fumadocs-engine'

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000'
  return generateRobots(siteOrigin)
}
