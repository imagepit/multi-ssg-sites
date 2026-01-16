import fs from 'node:fs/promises'
import path from 'node:path'

async function main() {
  const siteId = getArgValue('--site-id') || process.env.SITE_ID
  if (!siteId) {
    throw new Error('SITE_ID or --site-id is required')
  }

  const repoRoot = process.cwd()
  const siteRoot = process.env.SITE_ROOT || path.join(repoRoot, 'contents', siteId)
  const contentDir = path.join(siteRoot, 'contents')
  const spec = await readSpec(path.join(siteRoot, 'specs', 'spec.json'))
  const themeFromSpec = spec?.theme_id || spec?.themeId

  const site = {
    siteId,
    name: process.env.SITE_NAME || spec.site_name || siteId,
    domain: process.env.SITE_DOMAIN || undefined,
    themeId: process.env.THEME_ID || themeFromSpec || undefined,
    status: process.env.SITE_STATUS || 'active'
  }

  const files = await collectFiles(contentDir)
  const pages = []
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const frontmatter = parseFrontmatter(raw)
    if (!frontmatter) {
      continue
    }

    const title = valueToString(frontmatter.title)
    const slug = valueToString(frontmatter.slug)
    if (!title || !slug) {
      console.warn(`Skipping ${file}: title/slug missing`)
      continue
    }

    const parent = valueToString(frontmatter.parent)
    const pagePath = buildPath(slug, parent)
    const tags = normalizeTags(frontmatter.tags)
    const priority = normalizeNumber(frontmatter.priority)
    const updatedAt = valueToString(frontmatter.updated_at || frontmatter.updatedAt)

    const metadata = extractMetadata(frontmatter, [
      'title',
      'slug',
      'status',
      'tags',
      'priority',
      'updated_at',
      'updatedAt'
    ])

    pages.push({
      path: pagePath,
      slug,
      title,
      status: frontmatter.status,
      tags,
      priority,
      updatedAt,
      ...metadata
    })
  }

  const payload = {
    site,
    pages,
    sync: {
      mode: 'full',
      sentAt: new Date().toISOString()
    }
  }

  const adminApiKey = process.env.ADMIN_API_KEY
  if (!adminApiKey) {
    throw new Error('ADMIN_API_KEY is required')
  }

  const syncUrl = process.env.SYNC_URL || buildSyncUrl(process.env.ADMIN_APP_BASE_URL)
  if (!syncUrl) {
    throw new Error('SYNC_URL or ADMIN_APP_BASE_URL is required')
  }

  const response = await fetch(syncUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Api-Key': adminApiKey
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Sync failed: ${response.status} ${text}`)
  }

  const result = await response.json()
  console.log(JSON.stringify(result))
}

function getArgValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) {
    return null
  }
  return process.argv[index + 1] || null
}

function buildSyncUrl(base) {
  if (!base) {
    return null
  }
  const normalized = base.endsWith('/') ? base.slice(0, -1) : base
  return `${normalized}/admin/sync`
}

async function readSpec(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)))
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(fullPath)
    }
  }
  return files
}

function parseFrontmatter(content) {
  const lines = content.split('\n')
  if (lines[0]?.trim() !== '---') {
    return null
  }
  const data = {}
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.trim() === '---') {
      return data
    }
    if (!line.trim()) {
      continue
    }
    const idx = line.indexOf(':')
    if (idx === -1) {
      continue
    }
    const key = line.slice(0, idx).trim()
    const raw = line.slice(idx + 1).trim()
    data[key] = parseValue(raw)
  }
  return null
}

function parseValue(raw) {
  if (!raw) {
    return ''
  }
  const trimmed = raw.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) {
      return []
    }
    return inner.split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
  }
  if (trimmed === 'true') {
    return true
  }
  if (trimmed === 'false') {
    return false
  }
  if (!Number.isNaN(Number(trimmed))) {
    return Number(trimmed)
  }
  return trimmed
}

function valueToString(value) {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return ''
}

function normalizeTags(tags) {
  if (!tags) {
    return undefined
  }
  if (Array.isArray(tags)) {
    return tags.map((item) => String(item))
  }
  if (typeof tags === 'string') {
    return tags.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return undefined
}

function normalizeNumber(value) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function extractMetadata(source, excludedKeys) {
  const metadata = {}
  for (const [key, value] of Object.entries(source)) {
    if (excludedKeys.includes(key)) {
      continue
    }
    metadata[key] = value
  }
  return metadata
}

function buildPath(slug, parent) {
  if (!parent && (slug === 'home' || slug === 'index')) {
    return '/'
  }
  if (parent) {
    return `/${trimSlashes(parent)}/${trimSlashes(slug)}`
  }
  return `/${trimSlashes(slug)}`
}

function trimSlashes(value) {
  return String(value).replace(/^\/+|\/+$/g, '')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
