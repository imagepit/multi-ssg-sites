import fs from 'fs'
import path from 'path'
import { visit } from 'unist-util-visit'

type Element = { type: string; tagName?: string; properties?: Record<string, any>; children?: any[] }

export function rehypeNextImage(options?: { imagesDir?: string; className?: string; priority?: boolean }) {
  const imagesDir = options?.imagesDir || path.join(process.cwd(), 'public', 'images')
  const defaultClass = options?.className || 'markdown-image'
  const priority = options?.priority ?? false
  return function transformer(tree: any) {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img' || !node.properties) return
      const src = String(node.properties.src || '')
      if (!src || !src.startsWith('/images/')) return
      const rel = src.replace(/^\/images\//, '')
      const abs = path.join(imagesDir, rel)
      try { if (fs.existsSync(abs)) { /* could compute width/height here */ } } catch {}
      node.tagName = 'Image'
      const cn = String(node.properties.className || '')
      node.properties.className = cn ? `${cn} ${defaultClass}` : defaultClass
      if (priority) node.properties.priority = true
    })
  }
}

