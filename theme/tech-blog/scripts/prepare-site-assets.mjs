#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }
function rimraf(target) { if (!fs.existsSync(target)) return; const st = fs.statSync(target); if (st.isDirectory()) { for (const e of fs.readdirSync(target)) rimraf(path.join(target, e)); fs.rmSync(target, { recursive: true, force: true }) } else { fs.rmSync(target, { force: true }) } }
function copyIfExists(from, to) { if (fs.existsSync(from)) { ensureDir(path.dirname(to)); fs.copyFileSync(from, to); return true } return false }
function copyDirSync(srcDir, destDir) { if (!fs.existsSync(srcDir)) return 0; const stack = [[srcDir, destDir]]; let count=0; while (stack.length) { const [src, dest] = stack.pop(); const stat = fs.statSync(src); if (stat.isDirectory()) { ensureDir(dest); for (const entry of fs.readdirSync(src)) stack.push([path.join(src, entry), path.join(dest, entry)]) } else { ensureDir(path.dirname(dest)); fs.copyFileSync(src, dest); count++ } } return count }

function main() {
  const siteId = process.env.SITE_ID
  if (!siteId) { console.log('[prepare-site-assets] SITE_ID is not set. Skip copying.'); return }
  const appRoot = process.cwd()
  const workspaceRoot = path.resolve(appRoot, '..', '..')
  const specsDir = path.join(workspaceRoot, 'contents', siteId, 'specs')
  const brandImagesDir = path.join(workspaceRoot, 'images', siteId, 'brand')
  const publicDir = path.join(appRoot, 'public')
  const brandDir = path.join(publicDir, 'brand')
  const imagesOutDir = path.join(publicDir, 'images')

  ensureDir(publicDir); ensureDir(brandDir); ensureDir(imagesOutDir)
  rimraf(imagesOutDir); ensureDir(imagesOutDir)
  rimraf(path.join(publicDir, 'nextImageExportOptimizer'))
  for (const f of fs.readdirSync(publicDir)) { const p = path.join(publicDir, f); if (!fs.statSync(p).isDirectory() && /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f)) fs.rmSync(p, { force: true }) }

  const copied = []
  const faviconCandidates = ['favicon.ico','favicon.png','favicon.svg']
  let faviconCopied=false
  for (const name of faviconCandidates) { if (copyIfExists(path.join(brandImagesDir, name), path.join(publicDir, name))) { copied.push(`brand/${name}`); faviconCopied=true; break } }
  if (!faviconCopied) { for (const name of faviconCandidates) { if (copyIfExists(path.join(specsDir, name), path.join(publicDir, name))) { copied.push(name); break } } }

  let branding = { logo: null, favicon: null, og_image: null }
  try { const raw = fs.readFileSync(path.join(specsDir, 'spec.json'), 'utf8'); const spec = JSON.parse(raw); const b = spec?.theme_config?.branding || {}; branding.logo=b.logo||null; branding.favicon=b.favicon||null; branding.og_image=b.og_image||null } catch {}
  for (const filename of [branding.logo, branding.favicon, branding.og_image].filter(Boolean)) {
    const to = path.join(brandDir, filename)
    if (copyIfExists(path.join(brandImagesDir, filename), to)) { copied.push(`brand/${filename}`); continue }
    if (copyIfExists(path.join(specsDir, filename), to)) copied.push(`brand/${filename}`)
  }

  const manifestPath = path.join(workspaceRoot, 'tmp', `images-${siteId}.json`)
  if (fs.existsSync(manifestPath)) {
    try { const list = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); let cnt=0; for (const { dest, src } of list) { const to = path.join(publicDir, dest.replace(/^\//, '')); if (copyIfExists(src, to)) cnt++ } if (cnt>0) copied.push(`images-manifest (${cnt} files)`) } catch(e) { console.warn('[prepare-site-assets] failed to read manifest:', e?.message || e) }
  } else {
    const workspaceImagesRoot = path.join(workspaceRoot, 'images')
    const copiedCount = copyDirSync(workspaceImagesRoot, imagesOutDir)
    if (copiedCount>0) copied.push(`images/** (${copiedCount} files)`) 
  }
  console.log('[prepare-site-assets] copied:', copied)
}

main()

