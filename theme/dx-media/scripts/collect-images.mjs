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
  const imagesRoot = path.join(workspaceRoot, 'images')
  if (!fs.existsSync(siteContentsRoot)) {
    console.warn(`[collect-images] contents not found: ${siteContentsRoot}`)
    return
  }

  const { default: micromatch } = await import('micromatch')
  const { default: fg } = await import('fast-glob')

  const files = fg.sync(['**/*.{md,mdx}'], { cwd: siteContentsRoot, dot: false, absolute: true })
  const reImg = /!\[[^\]]*\]\(([^)]+)\)|<img[^>]*src=["']([^"']+)["']/gi
  // speech-left/right コールアウトからのavatar画像パス抽出（行頭空白を許容）
  const reSpeech = /^\s*:::speech-(?:left|right)\s+[^|]+\|\s*([^\s|]+)/gm

  const entries = new Map() // dest -> src

  function addImage(raw, baseDir, options = {}) {
    let cleaned = (raw || '').trim()
    if (!cleaned || /^https?:|^data:|^blob:/i.test(cleaned)) return

    // speech-left/right 用: /xxx → /images/xxx に正規化
    if (options.normalizePath && cleaned.startsWith('/') && !cleaned.startsWith('/images/')) {
      cleaned = '/images' + cleaned
    }

    let resolved
    if (cleaned.startsWith('/images/')) {
      const rel = cleaned.replace(/^\/images\//, '')
      resolved = path.join(imagesRoot, rel)
    } else if (options.allowImagesPrefix && cleaned.startsWith('images/')) {
      const rel = cleaned.replace(/^images\//, '')
      resolved = path.join(imagesRoot, rel)
    } else if (cleaned.startsWith('/')) {
      return
    } else {
      resolved = path.resolve(baseDir, cleaned)
    }

    let dest
    if (resolved.startsWith(imagesRoot + path.sep)) {
      const rel = path.relative(imagesRoot, resolved).replace(/\\/g, '/')
      dest = `/images/${rel}`
    } else if (resolved.startsWith(siteContentsRoot + path.sep)) {
      const rel = path.relative(siteContentsRoot, resolved).replace(/\\/g, '/')
      dest = `/images/${siteId}/${rel}`
    } else {
      dest = `/images/${siteId}/misc/${path.basename(resolved)}`
    }

    if (!micromatch.isMatch(dest.toLowerCase(), '**/*.{png,jpg,jpeg,webp,avif,gif,svg}')) return
    entries.set(dest, resolved)
  }

  for (const abs of files) {
    const text = fs.readFileSync(abs, 'utf8')
    const dir = path.dirname(abs)
    for (const m of text.matchAll(reImg)) {
      const raw = (m[1] || m[2] || '').trim()
      addImage(raw, dir)
    }
    // speech-left/right コールアウトからのavatar画像抽出
    for (const m of text.matchAll(reSpeech)) {
      const raw = (m[1] || '').trim()
      addImage(raw, dir, { normalizePath: true })
    }
  }

  const specPath = path.join(workspaceRoot, 'contents', siteId, 'specs', 'spec.json')
  if (fs.existsSync(specPath)) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
      const profileImage = spec?.theme_config?.profile?.image
      if (typeof profileImage === 'string') {
        addImage(profileImage, imagesRoot, { allowImagesPrefix: true })
      }
    } catch (error) {
      console.warn('[collect-images] failed to read spec.json:', error?.message || error)
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
