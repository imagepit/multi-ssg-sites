#!/usr/bin/env node
// Build static search indexes for documentation sites.
// - Supports per-site or all sites under `contents/*`
// - Skips unchanged sites by comparing mtimes to existing index files
// - Emits Orama RawData for Fumadocs static search: { type: 'simple', ...RawData }
//
// Examples:
//   node scripts/build-search-index.mjs --all
//   node scripts/build-search-index.mjs --site langchain
//   node scripts/build-search-index.mjs --all --force
//   node scripts/build-search-index.mjs --all --basePattern "/sites/{site}"

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { create, insertMultiple, save } from '@orama/orama'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true
    out[key] = val
  }
  return out
}

function parseCSV(csvText) {
  const rows = []
  let field = ''
  let row = []
  let inQuotes = false
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i]
    const next = csvText[i + 1]
    if (ch === '"') {
      if (inQuotes && next === '"') { field += '"'; i++ } else { inQuotes = !inQuotes }
    } else if (ch === ',' && !inQuotes) {
      row.push(field); field = ''
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else {
      field += ch
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

function toMapByHeader(rows) {
  if (!rows.length) return { header: [], items: [] }
  const header = rows[0].map(h => h.trim())
  const items = rows.slice(1).map(r => {
    const o = {}
    for (let i = 0; i < header.length; i++) o[header[i]] = (r[i] ?? '').trim()
    return o
  })
  return { header, items }
}

function stripFrontMatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3)
    if (end !== -1) return md.slice(end + 4)
  }
  return md
}

function extractTitleFromMd(md) {
  const m = md.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : ''
}

function stripMarkdown(md) {
  let text = md
  text = stripFrontMatter(text)
  text = text.replace(/```[\s\S]*?```/g, ' ')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  text = text.replace(/^\s{0,3}[>#*-]+\s?/gm, '')
  text = text.replace(/[`*_~]/g, '')
  text = text.replace(/[|]/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

function buildPath(slug, parentMap) {
  if (!slug) return ''
  const chain = []
  let cur = slug
  const guard = new Set()
  while (cur) {
    if (guard.has(cur)) break
    guard.add(cur)
    chain.push(cur)
    const p = parentMap.get(cur)
    if (!p) break
    cur = p
  }
  chain.reverse()
  if (chain.length === 1 && chain[0] === 'home') return '/'
  return '/' + chain.join('/')
}

function ensureDirSync(dir) { fs.mkdirSync(dir, { recursive: true }) }

function walkMtime(dir) {
  let latest = 0
  if (!fs.existsSync(dir)) return latest
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    const entries = fs.readdirSync(d, { withFileTypes: true })
    for (const e of entries) {
      if (e.name.startsWith('.git') || e.name === 'node_modules') continue
      const full = path.join(d, e.name)
      try {
        const st = fs.statSync(full)
        latest = Math.max(latest, st.mtimeMs)
        if (e.isDirectory()) stack.push(full)
      } catch {}
    }
  }
  return latest
}

async function buildSite({ root, site, outDir, basePattern }) {
  const siteRoot = path.join(root, 'contents', site)
  const csvPath = path.join(siteRoot, 'specs', 'page.csv')
  const contentsDir = path.join(siteRoot)
  if (!fs.existsSync(csvPath)) {
    return { site, skipped: true, reason: 'no-csv' }
  }

  const outFile = path.join(outDir, `${site}.json`)
  const metaFile = path.join(outDir, `${site}.meta.json`)

  // Incremental: skip if index is newer than latest change under site directory
  const idxMtime = fs.existsSync(outFile) ? fs.statSync(outFile).mtimeMs : 0
  const latestSrc = Math.max(
    walkMtime(path.join(siteRoot, 'contents')),
    walkMtime(path.join(siteRoot, 'specs')),
    fs.existsSync(csvPath) ? fs.statSync(csvPath).mtimeMs : 0
  )

  // prepare base path
  const base = (basePattern || '/sites/{site}').replace('{site}', site)

  const csvText = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCSV(csvText)
  const { items } = toMapByHeader(rows)
  const parentMap = new Map()
  for (const it of items) if (it.slug) parentMap.set(it.slug, (it.parent || '').trim())

  // Collect docs
  const docs = []
  let missingFiles = 0
  for (const it of items) {
    const slug = (it.slug || '').trim()
    const filepath = (it.filepath || '').trim()
    if (!slug || !filepath) continue
    const absPath = path.join(siteRoot, filepath)
    if (!fs.existsSync(absPath)) { missingFiles++; continue }
    const md = fs.readFileSync(absPath, 'utf8')
    const mdNoFm = stripFrontMatter(md)
    const title = (it.title || extractTitleFromMd(mdNoFm) || slug).trim()
    const text = stripMarkdown(mdNoFm)
    const fullPath = buildPath(slug, parentMap)
    const url = base.replace(/\/$/, '') + (fullPath === '/' ? '' : fullPath)
    const description = ''
    const keywords = ''
    docs.push({ url, title, description, content: text, keywords })
  }

  // If no source changed and index exists, skip writing
  if (idxMtime !== 0 && latestSrc <= idxMtime) {
    return { site, skipped: true, reason: 'up-to-date', count: docs.length, missingFiles }
  }

  // Build Orama DB (simple schema)
  const db = await create({
    schema: {
      url: 'string',
      title: 'string',
      description: 'string',
      content: 'string',
      keywords: 'string'
    },
    // Japanese is not supported by Orama tokenizer, fallback to 'english'
    language: 'english'
  })
  await insertMultiple(db, docs)
  const raw = save(db)

  ensureDirSync(outDir)
  fs.writeFileSync(outFile, JSON.stringify({ type: 'simple', ...raw }, null, 2))
  fs.writeFileSync(metaFile, JSON.stringify({ site, count: docs.length, missingFiles, base, generatedAt: new Date().toISOString() }, null, 2))

  // Also export a lightweight docs list for Japanese fallback search
  const clamp = (s, n = 4000) => (s.length > n ? s.slice(0, n) : s)
  const docsPlain = docs.map(d => ({ url: d.url, title: d.title, content: clamp(d.content) }))
  const docsFile = path.join(outDir, `${site}.docs.json`)
  fs.writeFileSync(docsFile, JSON.stringify({ site, base, count: docsPlain.length, docs: docsPlain }, null, 2))
  return { site, skipped: false, count: docs.length, missingFiles, base }
}

async function main() {
  const args = parseArgs()
  const root = path.resolve(__dirname, '..')
  const outDir = path.resolve(root, args.outDir || 'public/search-index')
  const basePattern = args.basePattern || '/sites/{site}'
  const force = !!args.force

  const sites = []
  const contentsRoot = path.join(root, 'contents')
  for (const entry of fs.readdirSync(contentsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const site = entry.name
    const csvPath = path.join(contentsRoot, site, 'specs', 'page.csv')
    if (fs.existsSync(csvPath)) sites.push(site)
  }

  let targetSites = sites
  if (args.site && args.site !== true) {
    const s = String(args.site)
    targetSites = sites.includes(s) ? [s] : []
  }

  ensureDirSync(outDir)

  const results = []
  for (const site of targetSites) {
    if (force) {
      // remove existing to ensure rebuild
      const f = path.join(outDir, `${site}.json`)
      try { fs.unlinkSync(f) } catch {}
    }
    const res = await buildSite({ root, site, outDir, basePattern })
    results.push(res)
  }

  // Write index of indexes for quick debugging
  const summary = {}
  for (const r of results) {
    summary[r.site] = {
      skipped: r.skipped,
      count: r.count || 0,
      base: r.base,
      reason: r.reason,
    }
  }
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify(summary, null, 2))

  const built = results.filter(r => !r.skipped).map(r => `${r.site}(${r.count})`).join(', ')
  const skipped = results.filter(r => r.skipped).map(r => `${r.site}:${r.reason}`).join(', ')
  console.log(`Search index build completed. Built: [${built}] Skipped: [${skipped}]`)
}

main().catch(err => { console.error(err); process.exit(1) })
