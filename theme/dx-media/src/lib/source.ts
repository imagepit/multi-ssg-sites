import { docs } from 'fumadocs-mdx:collections/server'
import type { PageTree } from 'fumadocs-core/server'
import {
  createSource,
  getLLMText as baseGetLLMText,
  getPageImage as baseGetPageImage,
  getSidebarMode,
} from '@techdoc/fumadocs-engine'
import { getSidebarTree } from '@techdoc/fumadocs-engine'

export const source = createSource(docs)

export const getPageImage = baseGetPageImage
export const getLLMText = baseGetLLMText

export function getSitemapTree(): PageTree.Root {
  const siteId = process.env.SITE_ID || null
  const mode = getSidebarMode({ siteId, fallback: 'sitemap' })
  return getSidebarTree({
    mode,
    siteId,
    source,
    fallback: source.pageTree as unknown as PageTree.Root,
  })
}
