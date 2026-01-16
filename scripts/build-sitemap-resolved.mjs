#!/usr/bin/env node
/*
  Build resolved sitemap JSON per site.
  Input: contents/<site>/specs/sitemap.md
  Output: contents/<site>/specs/sitemap.resolved.json
*/
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const CONTENTS_DIR = path.join(ROOT, 'contents')

function listSites(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf-8') } catch { return null }
}

function exists(p) {
  try { return fs.existsSync(p) } catch { return false }
}

function normalizeLink(link) {
  let l = (link || '').split('#')[0].split('?')[0]
  l = l.replace(/^\.\//, '').replace(/^\//, '').replace(/^contents\//, '')
  return l
}

function toSlug(link) {
  let s = normalizeLink(link)
  if (s === 'home' || s === 'home.md' || s === './home.md') return 'home'
  s = s.replace(/\.(md|mdx)$/i, '')
  s = s.replace(/\/index$/i, '')
  return s
}

function resolveFile(siteBase, link) {
  const l = normalizeLink(link)
  const hasExt = /\.(md|mdx)$/i.test(l)
  const candidates = []
  if (hasExt) {
    candidates.push(path.join(siteBase, 'contents', l))
  } else {
    candidates.push(path.join(siteBase, 'contents', `${l}.md`))
    candidates.push(path.join(siteBase, 'contents', l, 'index.md'))
    candidates.push(path.join(siteBase, 'contents', `${l}.mdx`))
    candidates.push(path.join(siteBase, 'contents', l, 'index.mdx'))
  }
  for (const full of candidates) {
    if (exists(full)) {
      return path.relative(siteBase, full).replace(/\\/g, '/')
    }
  }
  return ''
}

function parseSitemapToTree(siteBase, content) {
  const lines = content.split(/\r?\n/)
  const itemRegex = /^(\s*)[-*]\s+(?:\[([^\]]+)\]\(([^)]+)\)|([^\n]+))\s*$/
  const roots = []
  const stack = [] // {node, depth}

  for (const raw of lines) {
    const m = raw.match(itemRegex)
    if (!m) continue
    const indent = m[1] || ''
    const depth = Math.floor(indent.replace(/\t/g, '  ').length / 2)
    const title = (m[2] || m[4] || '').trim()
    const href = (m[3] || '').trim()
    if (!title) continue

    let slug = ''
    let filepath = ''
    let hasH1 = false
    if (href) {
      slug = toSlug(href)
      filepath = resolveFile(siteBase, href)
      if (filepath) {
        // Detect H1 in file by reading content without frontmatter
        const full = path.join(siteBase, filepath)
        try {
          const raw = fs.readFileSync(full, 'utf-8')
          const parsed = matter(raw)
          hasH1 = /^\s*#\s+.+/m.test(parsed.content || '')
        } catch {}
      }
    }

    const node = { title, slug, filepath, children: [], level: depth, hasH1 }
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop()
    if (stack.length === 0) roots.push(node)
    else stack[stack.length - 1].node.children.push(node)
    stack.push({ node, depth })
  }
  return roots
}

function flattenPreorder(nodes) {
  const out = []
  const visit = (n) => { out.push(n); (n.children || []).forEach(visit) }
  nodes.forEach(visit)
  return out
}

function buildForSite(siteId) {
  const siteBase = path.join(CONTENTS_DIR, siteId)
  const sitemapMd = path.join(siteBase, 'specs', 'sitemap.md')
  if (!exists(sitemapMd)) return false
  const md = readFileSafe(sitemapMd)
  if (!md) return false

  const tree = parseSitemapToTree(siteBase, md)
  const flat = flattenPreorder(tree).map((n) => ({ slug: n.slug, title: n.title, filepath: n.filepath }))
  const out = {
    version: 1,
    generatedAt: new Date().toISOString(),
    tree,
    flat,
  }
  const outPath = path.join(siteBase, 'specs', 'sitemap.resolved.json')
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8')
  return true
}

function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const sites = all ? listSites(CONTENTS_DIR) : args.filter((a) => !a.startsWith('--'))
  if (sites.length === 0) {
    console.log('No target sites. Use --all or pass site ids.')
    process.exit(0)
  }
  let ok = 0, skipped = 0
  for (const site of sites) {
    try {
      const built = buildForSite(site)
      if (built) { ok++; console.log(`Built resolved sitemap for ${site}`) }
      else { skipped++; console.log(`Skipped ${site}`) }
    } catch (e) {
      console.warn(`Failed for ${site}:`, e)
    }
  }
  console.log(`Done. success=${ok}, skipped=${skipped}`)
}

main()
