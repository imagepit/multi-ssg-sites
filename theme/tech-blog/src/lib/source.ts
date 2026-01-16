import { docs } from '@/.source'
import { loader } from 'fumadocs-core/source'
import type { PageTree } from 'fumadocs-core/server'
import fs from 'node:fs'
import path from 'node:path'

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
})

// Optional: sitemap.md を使ったツリー生成（無ければ自動）
type SiteNode = { title: string; href: string | null; children: SiteNode[] }

function parseSitemapMarkdown(markdown: string): SiteNode[] {
  const lines = markdown.split(/\r?\n/)
  const root: SiteNode = { title: '__root__', href: null, children: [] }
  const stack: { level: number; node: SiteNode }[] = [{ level: -1, node: root }]
  const itemRegex = /^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)/
  for (const line of lines) {
    const m = line.match(itemRegex)
    if (!m) continue
    const level = Math.floor((m[1] ?? '').length / 2)
    const title = m[2].trim()
    const href = m[3].trim()
    const node: SiteNode = { title, href, children: [] }
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop()
    const parent = stack[stack.length - 1]?.node ?? root
    parent.children.push(node)
    stack.push({ level, node })
  }
  return root.children
}

function resolveUrlFromHref(href: string): string {
  const noExt = href.replace(/\.(md|mdx)$/i, '')
  const clean = noExt.replace(/^\.\//, '')
  return '/' + clean
}

function createPageItem(title: string, href: string): PageTree.Item {
  const virtualPath = `docs/${href}`
  const resolved = source.getPageByHref(virtualPath)
  const url = resolved?.page?.url ?? resolveUrlFromHref(href)
  return { type: 'page', name: title, url }
}

function convertNodesToPageTree(nodes: SiteNode[]): PageTree.Root {
  function toNode(n: SiteNode): PageTree.Node {
    if (n.children.length === 0) {
      if (!n.href) return { type: 'separator', name: n.title } as PageTree.Separator
      return createPageItem(n.title, n.href)
    }
    const children: PageTree.Node[] = n.children.map(toNode)
    return { type: 'folder', name: n.title, children, defaultOpen: false } as PageTree.Folder
  }
  return { name: 'ホーム', children: nodes.map(toNode) }
}

let sitemapTreeCache: PageTree.Root | null = null
export function getSitemapTree(): PageTree.Root {
  if (sitemapTreeCache) return sitemapTreeCache
  const siteId = process.env.SITE_ID
  const sitemapPath = siteId
    ? path.resolve(process.cwd(), '..', '..', 'contents', siteId, 'specs', 'sitemap.md')
    : path.join(process.cwd(), 'specs', 'sitemap.md')
  try {
    const md = fs.readFileSync(sitemapPath, 'utf8')
    sitemapTreeCache = convertNodesToPageTree(parseSitemapMarkdown(md))
  } catch {
    sitemapTreeCache = source.pageTree as unknown as PageTree.Root
  }
  return sitemapTreeCache
}

