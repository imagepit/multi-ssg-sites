#!/usr/bin/env node
/*
  Copy per-site branding assets from workspace contents/[SITE_ID]/specs
  into this app's public directories so that SSG/export works without
  any Route Handlers.
*/
import fs from 'node:fs'
import path from 'node:path'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyIfExists(from, to) {
  if (fs.existsSync(from)) {
    ensureDir(path.dirname(to))
    fs.copyFileSync(from, to)
    return true
  }
  return false
}

function copyDirSync(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0
  const stack = [[srcDir, destDir]]
  let count = 0
  while (stack.length) {
    const [src, dest] = stack.pop()
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      ensureDir(dest)
      for (const entry of fs.readdirSync(src)) {
        stack.push([path.join(src, entry), path.join(dest, entry)])
      }
    } else {
      ensureDir(path.dirname(dest))
      fs.copyFileSync(src, dest)
      count++
    }
  }
  return count
}

function rimraf(target) {
  if (!fs.existsSync(target)) return
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    for (const e of fs.readdirSync(target)) rimraf(path.join(target, e))
    fs.rmSync(target, { recursive: true, force: true })
  } else {
    fs.rmSync(target, { force: true })
  }
}

function main() {
  const siteId = process.env.SITE_ID
  if (!siteId) {
    console.log('[prepare-site-assets] SITE_ID is not set. Skip copying.')
    return
  }

  const appRoot = process.cwd()
  const workspaceRoot = path.resolve(appRoot, '..', '..')
  const specsDir = path.join(workspaceRoot, 'contents', siteId, 'specs')
  const brandImagesDir = path.join(workspaceRoot, 'images', siteId, 'brand')

  if (!fs.existsSync(specsDir)) {
    console.warn(`[prepare-site-assets] specs dir not found: ${specsDir}`)
    return
  }

  // Load spec.json if present to find branding file names
  let branding = { logo: null, favicon: null, og_image: null }
  try {
    const raw = fs.readFileSync(path.join(specsDir, 'spec.json'), 'utf8')
    const spec = JSON.parse(raw)
    const b = spec?.theme_config?.branding || {}
    branding.logo = b.logo || null
    branding.favicon = b.favicon || null
    branding.og_image = b.og_image || null
  } catch {}

  const publicDir = path.join(appRoot, 'public')
  const brandDir = path.join(publicDir, 'brand')
  const imagesOutDir = path.join(publicDir, 'images')
  ensureDir(publicDir)
  ensureDir(brandDir)
  ensureDir(imagesOutDir)

  const copied = []

  // Clean previous images to avoid cross-site leakage
  // 1) wipe /public/images and /public/nextImageExportOptimizer
  rimraf(imagesOutDir)
  ensureDir(imagesOutDir)
  rimraf(path.join(publicDir, 'nextImageExportOptimizer'))
  // 2) remove stray image files at public root (png|jpg|jpeg|webp|avif|gif|svg)
  for (const f of fs.readdirSync(publicDir)) {
    const p = path.join(publicDir, f)
    if (fs.statSync(p).isDirectory()) continue
    if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f)) {
      fs.rmSync(p, { force: true })
    }
  }

  // Try common favicon names first (priority: images/[site]/brand -> specs)
  const faviconCandidates = ['favicon.ico', 'favicon.png', 'favicon.svg']
  let faviconCopied = false
  for (const name of faviconCandidates) {
    const fromBrand = path.join(brandImagesDir, name)
    if (copyIfExists(fromBrand, path.join(publicDir, name))) {
      copied.push(`brand/${name}`)
      faviconCopied = true
      break
    }
  }
  if (!faviconCopied) {
    for (const name of faviconCandidates) {
      const fromSpecs = path.join(specsDir, name)
      if (copyIfExists(fromSpecs, path.join(publicDir, name))) {
        copied.push(name)
        break
      }
    }
  }

  // Also copy branding-defined files into /public/brand/ (priority: images/[site]/brand/*)
  const entries = [branding.logo, branding.favicon, branding.og_image].filter(Boolean)
  for (const filename of entries) {
    const fromBrand = path.join(brandImagesDir, filename)
    const to = path.join(brandDir, filename)
    if (copyIfExists(fromBrand, to)) { copied.push(`brand/${filename}`); continue }
    const fromSpecs = path.join(specsDir, filename)
    if (copyIfExists(fromSpecs, to)) copied.push(`brand/${filename}`)
  }

  // If a manifest exists (collected per site), copy only listed files
  const manifestPath = path.join(workspaceRoot, 'tmp', `images-${siteId}.json`)
  if (fs.existsSync(manifestPath)) {
    try {
      const list = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      let cnt = 0
      for (const { dest, src } of list) {
        const to = path.join(publicDir, dest.replace(/^\//, ''))
        if (copyIfExists(src, to)) cnt++
      }
      if (cnt > 0) copied.push(`images-manifest (${cnt} files)`) 
    } catch (e) {
      console.warn('[prepare-site-assets] failed to read manifest:', e?.message || e)
    }
  } else {
    // Fallback: copy entire workspace images -> /public/images to avoid missing cross-site refs
    const workspaceImagesRoot = path.join(workspaceRoot, 'images')
    const copiedCount = copyDirSync(workspaceImagesRoot, imagesOutDir)
    if (copiedCount > 0) copied.push(`images/** (${copiedCount} files)`) 
  }

  // Copy site local images if present (contents/[site]/contents/**/images/*)
  const siteContentsDir = path.join(workspaceRoot, 'contents', siteId, 'contents')
  function copySiteImages(dir) {
    if (!fs.existsSync(dir)) return 0
    let c = 0
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry)
      const st = fs.statSync(p)
      if (st.isDirectory()) {
        if (entry === 'images') {
          c += copyDirSync(p, imagesOutDir)
        } else {
          c += copySiteImages(p)
        }
      }
    }
    return c
  }
  const siteCopied = copySiteImages(siteContentsDir)
  if (siteCopied > 0) copied.push(`site-images (${siteCopied} files)`) 

  console.log('[prepare-site-assets] copied:', copied)
}

main()


