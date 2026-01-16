#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import glob from 'fast-glob'
import { create, insertMultiple, save } from '@orama/orama'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

function extractTextFromMarkdown(content) {
  const { content: markdown } = matter(content)
  let text = markdown.replace(/```[\w]*\n([\s\S]*?)```/g, ' $1 ')
  text = text.replace(/`([^`]+)`/g, '$1')
  text = text.replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/^#{1,6}\s+/gm, '')
  return text.replace(/\s+/g, ' ').trim()
}

function urlFromPath(relativePath) {
  let url = relativePath.replace(/\.(md|mdx)$/i, '')
  if (url === 'index' || url.endsWith('/index')) url = url.replace(/\/?index$/, '') || '/'
  if (!url.startsWith('/')) url = '/' + url
  return url
}

async function main() {
  const siteId = process.env.SITE_ID || process.env.NEXT_PUBLIC_SITE_ID
  if (!siteId) { console.log('[generate-search-index] SITE_ID not set; skip'); return }
  const appRoot = process.cwd()
  const workspaceRoot = path.resolve(appRoot, '..', '..')
  const contentsDir = path.join(workspaceRoot, 'contents', siteId, 'contents')
  if (!fs.existsSync(contentsDir)) { console.error('[generate-search-index] Contents not found:', contentsDir); process.exit(1) }
  const files = await glob('**/*.{md,mdx}', { cwd: contentsDir, ignore: ['**/README.md','**/AGENTS.md','**/CLAUDE.md'] })
  const db = await create({ schema: { id: 'string', title: 'string', url: 'string', description: 'string', body: 'string' } })
  const docs = []
  for (const rel of files) {
    const abs = path.join(contentsDir, rel)
    const raw = fs.readFileSync(abs, 'utf8')
    const fm = matter(raw)
    const url = urlFromPath(rel)
    docs.push({ id: url, title: fm.data.title || url, url, description: fm.data.description || '', body: extractTextFromMarkdown(raw) })
  }
  await insertMultiple(db, docs)
  const outDir = path.join(appRoot, 'public', 'search-indexes')
  ensureDir(outDir)
  const outPath = path.join(outDir, `${siteId}.json`)
  await save(db, outPath)
  console.log('[generate-search-index] Generated:', outPath)
}

main()

