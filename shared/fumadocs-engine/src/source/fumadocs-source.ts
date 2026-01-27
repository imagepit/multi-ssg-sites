import { type InferPageType, loader } from 'fumadocs-core/source'
import type * as PageTree from 'fumadocs-core/page-tree'
import { getBranding } from '../site/spec.ts'

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
  const getText = (page.data as { getText?: (format: string) => Promise<string> }).getText
  const processed = getText ? await getText('raw') : ''
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
