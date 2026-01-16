import fs from 'node:fs'
import path from 'node:path'
import type { PageTree } from 'fumadocs-core/server'
import type { SidebarMode } from '../source/fumadocs-source.js'

// Structure used for sitemap parsing
export type SiteNode = {
  title: string
  href: string | null
  children: SiteNode[]
}

function parseSitemapMarkdown(markdown: string): SiteNode[] {
  const lines = markdown.split(/\r?\n/)
  const root: SiteNode = { title: '__root__', href: null, children: [] }
  const stack: { level: number; node: SiteNode }[] = [{ level: -1, node: root }]
  const itemRegex = /^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)/

  for (const line of lines) {
    const match = line.match(itemRegex)
    if (!match) continue
    const indent = match[1] ?? ''
    const title = match[2].trim()
    const hrefRaw = match[3].trim()
    const level = Math.floor(indent.length / 2)

    const node: SiteNode = { title, href: hrefRaw, children: [] }
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop()
    }
    const parent = stack[stack.length - 1]?.node ?? root
    parent.children.push(node)
    stack.push({ level, node })
  }
  return root.children
}

function resolveUrlFromHref(href: string): string {
  if (href === 'home.md' || href === './home.md') return '/'
  const noExt = href.replace(/\.(md|mdx)$/i, '')
  const clean = noExt.replace(/^\.\//, '')
  return `/${clean}`
}

function createPageItem(title: string, href: string, source: any): PageTree.Item {
  const virtualPath = href === 'home.md' ? 'docs/index.mdx' : `docs/${href}`
  const resolved = source.getPageByHref?.(virtualPath)
  const url = resolved?.page?.url ?? resolveUrlFromHref(href)
  return {
    type: 'page',
    name: title,
    url,
  }
}

function convertNodesToPageTree(nodes: SiteNode[], source: any): PageTree.Root {
  function toNode(n: SiteNode): PageTree.Node {
    if (n.children.length === 0) {
      if (!n.href) {
        return { type: 'separator', name: n.title } as PageTree.Separator
      }
      return createPageItem(n.title, n.href, source)
    }

    const children: PageTree.Node[] = []
    let index: PageTree.Item | undefined
    if (n.href) index = createPageItem(n.title, n.href, source)
    for (const child of n.children) children.push(toNode(child))
    return {
      type: 'folder',
      name: n.title,
      children,
      ...(index ? { index } : {}),
      defaultOpen: false,
    } as PageTree.Folder
  }

  const children: PageTree.Node[] = nodes.map((n) => toNode(n))
  return { name: 'ホーム', children }
}

export function getSidebarTree(options: {
  mode: SidebarMode
  siteId?: string | null
  rootDir?: string | null
  source: any
  fallback?: PageTree.Root
}): PageTree.Root {
  const { mode, siteId, rootDir, source } = options
  if (mode === 'none') {
    return { name: 'ホーム', children: [] }
  }

  if (mode === 'auto') {
    return (options.fallback as PageTree.Root) || (source.pageTree as unknown as PageTree.Root)
  }

  const baseDir = rootDir || process.cwd()
  const sitemapPath = siteId
    ? path.resolve(baseDir, '..', '..', 'contents', siteId, 'specs', 'sitemap.md')
    : path.join(baseDir, 'specs', 'sitemap.md')

  try {
    const content = fs.readFileSync(sitemapPath, 'utf8')
    const nodes = parseSitemapMarkdown(content)
    return convertNodesToPageTree(nodes, source)
  } catch {
    return (options.fallback as PageTree.Root) || (source.pageTree as unknown as PageTree.Root)
  }
}
