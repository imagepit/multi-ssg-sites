import { type InferPageType, loader } from 'fumadocs-core/source'
import type { PageTree } from 'fumadocs-core/server'
import { getBranding } from '../site/spec.js'

export function createSource(docs: any) {
  return loader({
    baseUrl: '/',
    source: docs.toFumadocsSource(),
    pageTree: {
      transformers: [
        {
          root: (node) => ({ ...node, name: 'ホーム' }),
        },
      ],
    },
  })
}

export function getPageImage(page: InferPageType<ReturnType<typeof createSource>>) {
  const branding = getBranding()
  const og = branding?.ogImage || branding?.logo || null
  return {
    segments: [],
    url: og ? `/brand/${og}` : '/brand/logo.svg',
  }
}

export async function getLLMText(page: InferPageType<ReturnType<typeof createSource>>) {
  const processed = await page.data.getText('raw')
  return `# ${page.data.title} (${page.url})\n\n${processed}`
}

export type SidebarMode = 'sitemap' | 'auto' | 'none'

export type SidebarOptions = {
  mode: SidebarMode
  siteId?: string | null
  rootDir?: string | null
  source: ReturnType<typeof createSource>
  fallback?: PageTree.Root
}
