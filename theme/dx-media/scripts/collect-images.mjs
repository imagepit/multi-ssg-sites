#!/usr/bin/env node
/*
  Scan site MD/MDX and collect referenced images to build a manifest of files
  to copy into public/images for per-site optimization.
*/
import fs from 'node:fs'
import path from 'node:path'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function main() {
  const siteId = process.env.SITE_ID
  if (!siteId) {
    console.log('[collect-images] SITE_ID not set; skip')
    return
  }
  const appRoot = process.cwd()
  const workspaceRoot = path.resolve(appRoot, '..', '..')
  const siteContentsRoot = path.join(workspaceRoot, 'contents', siteId, 'contents')
  if (!fs.existsSync(siteContentsRoot)) {
    console.warn(`[collect-images] contents not found: ${siteContentsRoot}`)
    return
  }

  const { default: micromatch } = await import('micromatch')
  const { default: fg } = await import('fast-glob')

  const files = fg.sync(['**/*.{md,mdx}'], { cwd: siteContentsRoot, dot: false, absolute: true })
  const reImg = /!\[[^\]]*\]\(([^)]+)\)|<img[^>]*src=["']([^"']+)["']/gi

  const entries = new Map() // dest -> src

  for (const abs of files) {
    const text = fs.readFileSync(abs, 'utf8')
    const dir = path.dirname(abs)
    for (const m of text.matchAll(reImg)) {
      const raw = (m[1] || m[2] || '').trim()
      if (!raw || /^https?:|^data:|^blob:/i.test(raw)) continue

      const imagesRoot = path.join(workspaceRoot, 'images')
      let resolved
      if (raw.startsWith('/images/')) {
        // Absolute workspace images path: map to workspace imagesRoot
        const rel = raw.replace(/^\/images\//, '')
        resolved = path.join(imagesRoot, rel)
      } else if (raw.startsWith('/')) {
        // Other absolute paths are not supported; skip
        continue
      } else {
        // Relative to markdown file
        resolved = path.resolve(dir, raw)
      }

      // Compute destination under /images, allowing any path within imagesRoot
      let dest
      if (resolved.startsWith(imagesRoot + path.sep)) {
        const rel = path.relative(imagesRoot, resolved).replace(/\\/g, '/')
        dest = `/images/${rel}`
      } else if (resolved.startsWith(siteContentsRoot + path.sep)) {
        // Local images placed near MDX files -> namespace under siteId
        const rel = path.relative(siteContentsRoot, resolved).replace(/\\/g, '/')
        dest = `/images/${siteId}/${rel}`
      } else {
        // Fallback: place under /images/[siteId]/misc/ preserving filename
        dest = `/images/${siteId}/misc/${path.basename(resolved)}`
      }

      // crude filter to include only common image extensions
      if (!micromatch.isMatch(dest.toLowerCase(), '**/*.{png,jpg,jpeg,webp,avif,gif,svg}')) continue
      entries.set(dest, resolved)
    }
  }

  const outDir = path.join(workspaceRoot, 'tmp')
  ensureDir(outDir)
  const manifestPath = path.join(outDir, `images-${siteId}.json`)
  const arr = [...entries.entries()].map(([dest, src]) => ({ dest, src }))
  fs.writeFileSync(manifestPath, JSON.stringify(arr, null, 2))
  console.log(`[collect-images] wrote ${arr.length} entries to ${manifestPath}`)
}

main()

