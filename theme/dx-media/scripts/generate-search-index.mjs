#!/usr/bin/env node
/**
 * Generate static search index for SSG builds in Orama format
 * Compatible with Fumadocs static search
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import glob from 'fast-glob'
import { create, insertMultiple, save } from '@orama/orama'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function extractTextFromMarkdown(content) {
  // Remove frontmatter
  const { content: markdown } = matter(content)

  // Extract code blocks content (keep the code, remove the backticks and language identifier)
  let text = markdown.replace(/```[\w]*\n([\s\S]*?)```/g, ' $1 ')

  // Remove inline code backticks but keep content
  text = text.replace(/`([^`]+)`/g, '$1')

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '')

  // Remove markdown headers
  text = text.replace(/^#{1,6}\s+/gm, '')

  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

function extractHeadings(markdown) {
  const headings = []
  const lines = markdown.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()

      // Generate slug for anchor (support Japanese characters)
      // Remove markdown syntax (**, __, etc.) and special chars, keep alphanumeric and Japanese
      let slug = text
        .replace(/\*\*/g, '')        // Remove bold markdown
        .replace(/__/g, '')          // Remove italic markdown
        .replace(/`[^`]*`/g, '')     // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
        .toLowerCase()
        .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '') // Keep alphanumeric, hiragana, katakana, kanji, spaces, hyphens
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/-+/g, '-')         // Replace multiple hyphens with single
        .replace(/^-|-$/g, '')       // Trim hyphens from start/end

      // If slug is empty (e.g., emoji-only headings), use a fallback
      if (!slug) {
        slug = `heading-${level}-${headings.length}`
      }

      // Extract content under this heading (until next heading of same or higher level)
      const contentLines = []
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j]
        // Check if this is a heading of same or higher level
        const nextHeading = nextLine.match(/^(#{1,6})\s+/)
        if (nextHeading && nextHeading[1].length <= level) {
          break
        }
        contentLines.push(nextLine)
      }
      const content = contentLines.join('\n')

      headings.push({ level, text, slug, content })
    }
  }

  return headings
}

function urlFromPath(relativePath) {
  // Remove .md/.mdx extension
  let url = relativePath.replace(/\.(md|mdx)$/i, '')

  // Convert index to root
  if (url === 'index' || url.endsWith('/index')) {
    url = url.replace(/\/?index$/, '') || '/'
  }

  // Ensure leading slash
  if (!url.startsWith('/')) {
    url = '/' + url
  }

  return url
}

async function main() {
  // SITE_ID or NEXT_PUBLIC_SITE_ID from environment
  const siteId = process.env.SITE_ID || process.env.NEXT_PUBLIC_SITE_ID
  if (!siteId) {
    console.log('[generate-search-index] SITE_ID/NEXT_PUBLIC_SITE_ID not set; skip')
    return
  }

  const appRoot = process.cwd()
  const workspaceRoot = path.resolve(appRoot, '..', '..')
  const contentsDir = path.join(workspaceRoot, 'contents', siteId, 'contents')

  if (!fs.existsSync(contentsDir)) {
    console.error('[generate-search-index] Contents directory not found:', contentsDir)
    process.exit(1)
  }

  console.log('[generate-search-index] Scanning:', contentsDir)

  // Find all MD/MDX files
  const files = await glob('**/*.{md,mdx}', {
    cwd: contentsDir,
    ignore: ['**/node_modules/**', '**/README.md', '**/AGENTS.md', '**/CLAUDE.md'],
  })

  console.log('[generate-search-index] Found', files.length, 'files')

  const docs = []
  let entryId = 0

  for (const file of files) {
    try {
      const fullPath = path.join(contentsDir, file)
      const content = fs.readFileSync(fullPath, 'utf8')
      const { data: frontmatter, content: markdown } = matter(content)

      const url = urlFromPath(file)
      const title = frontmatter.title || path.basename(file, path.extname(file))
      const description = frontmatter.description || frontmatter.seo_description || ''
      const keywords = frontmatter.keywords || ''

      // Extract plain text for search
      const plainText = extractTextFromMarkdown(content)

      // Build breadcrumbs from file path
      const breadcrumbs = file
        .split('/')
        .slice(0, -1)
        .filter(Boolean)
        .map(seg => seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))

      // Add page entry
      const pageId = `page-${entryId++}`
      docs.push({
        id: pageId,
        type: 'page',
        page_id: pageId,
        url,
        title,
        description,
        content: plainText,
        breadcrumbs,
        keywords: typeof keywords === 'string' ? keywords : keywords.join(' '),
      })

      // Extract and add heading entries
      const headings = extractHeadings(markdown)
      for (const heading of headings) {
        // Only index h2 and h3 headings for better results
        if (heading.level >= 2 && heading.level <= 3) {
          // Extract plain text from the heading's content (including code blocks)
          const headingContent = extractTextFromMarkdown(`---\n---\n${heading.content}`)

          docs.push({
            id: `heading-${entryId++}`,
            type: 'heading',
            page_id: pageId,
            url: `${url}#${heading.slug}`,
            title: heading.text,
            content: `${heading.text} ${headingContent}`,
            breadcrumbs: [...breadcrumbs, title],
            keywords: '',
          })
        }
      }
    } catch (error) {
      console.error('[generate-search-index] Error processing file:', file, error)
    }
  }

  // 日本語トークナイザー
  function createJapaneseTokenizer() {
    const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
      ? new Intl.Segmenter('ja', { granularity: 'word' })
      : null

    const normalize = (token) => token.toLowerCase()

    const tokenize = function (input) {
      if (typeof input !== 'string') return [String(input ?? '')]

      if (!segmenter) {
        // Fallback: CJK文字ごとに分割
        const words = input
          .split(/\s+/)
          .flatMap((w) => (/[\u3040-\u30ff\u3400-\u9fff]/.test(w) ? w.split('') : [w]))
          .filter(Boolean)
        return words.map(normalize)
      }

      const it = segmenter.segment(input)
      const out = []
      for (const seg of it) {
        if (seg.isWordLike && seg.segment) {
          out.push(normalize(seg.segment))
        }
      }
      return Array.from(new Set(out.filter(Boolean)))
    }

    return tokenize
  }

  const db = await create({
    schema: {
      id: 'string',
      type: 'string',
      page_id: 'string',
      url: 'string',
      title: 'string',
      description: 'string',
      content: 'string',
      keywords: 'string',
      breadcrumbs: 'string[]'
    },
    components: {
      tokenizer: {
        tokenize: createJapaneseTokenizer(),
        language: 'japanese',
        normalizationCache: new Map()
      }
    }
  })

  if (docs.length > 0) {
    await insertMultiple(db, docs)
  }

  const raw = save(db)

  const outDir = path.join(appRoot, 'public', 'search-indexes')
  ensureDir(outDir)

  const outputPath = path.join(outDir, `${siteId}.json`)
  // Save in Fumadocs-compatible format with type: 'simple'
  fs.writeFileSync(outputPath, JSON.stringify({ type: 'simple', ...raw }, null, 2), 'utf8')

  console.log('[generate-search-index] Generated Orama search index:', outputPath)
  console.log('[generate-search-index] Total entries:', docs.length)
}

main().catch((err) => {
  console.error('[generate-search-index] Error:', err)
  process.exit(1)
})