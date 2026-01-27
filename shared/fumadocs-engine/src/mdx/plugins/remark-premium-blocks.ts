import type { Root, Content, Paragraph } from 'mdast'
import { visit } from 'unist-util-visit'
import type { PremiumSection, PremiumPlaceholder } from '../../domain/premium-section.ts'

/**
 * Metadata stored in vfile.data for extracted premium sections
 */
export interface PremiumBlocksData {
  premiumSections: Array<{
    sectionId: string
    productId: string
    /** Original mdast nodes of the premium content (before HTML conversion) */
    nodes: Content[]
  }>
}

/**
 * Remark plugin that transforms :::premium blocks into placeholders
 *
 * Syntax:
 * ```mdx
 * :::premium productId="product:course-xxx" sectionId="section-1"
 *
 * Premium content here...
 *
 * :::
 * ```
 *
 * The plugin:
 * 1. Detects :::premium ... ::: blocks
 * 2. Extracts the content and stores it in vfile.data.premiumSections
 * 3. Replaces the block with a placeholder component
 */
export function remarkPremiumBlocks() {
  return (tree: Root, vfile: any) => {
    // Initialize premium sections array in vfile.data
    if (!vfile.data) {
      vfile.data = {}
    }
    if (!vfile.data.premiumSections) {
      vfile.data.premiumSections = []
    }

    visit(tree, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return
      if (node.type !== 'paragraph') return

      const text = flatten(node as Paragraph)
      const open = parsePremiumOpen(text)
      if (!open) return

      // Find the matching closing :::
      // Support nested admonitions (:::note, :::warning, etc.) inside premium blocks
      let end = -1
      let depth = 0
      for (let i = index + 1; i < parent.children.length; i++) {
        const n = parent.children[i]
        if (n.type === 'paragraph') {
          const t = flatten(n as Paragraph).trim()
          if (isAdmonitionOpen(t)) {
            depth++
            continue
          }
          if (t === ':::') {
            if (depth > 0) {
              depth--
              continue
            }
            end = i
            break
          }
        }
      }

      if (end === -1) return

      // Extract the content between open and close
      const inner = parent.children.slice(index + 1, end) as Content[]

      // Store the extracted section data in vfile
      vfile.data.premiumSections.push({
        sectionId: open.sectionId,
        productId: open.productId,
        nodes: inner,
      })

      // Create placeholder element
      const placeholder: Content = {
        type: 'mdxJsxFlowElement' as any,
        name: 'PremiumPlaceholder',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'sectionId', value: open.sectionId },
          { type: 'mdxJsxAttribute', name: 'productId', value: open.productId },
        ] as any,
        children: [],
      }

      // Replace the entire block (open tag + content + close tag) with placeholder
      parent.children.splice(index, end - index + 1, placeholder)

      // Tell visitor to continue after inserted node
      return index
    })
  }
}

/**
 * Parse the opening tag of a premium block
 *
 * Supported formats:
 * - :::premium productId="xxx" sectionId="yyy"
 * - :::premium sectionId="yyy" productId="xxx"
 */
function parsePremiumOpen(text: string): { productId: string; sectionId: string } | null {
  const s = text.trim()
  if (!s.startsWith(':::premium')) return null

  const rest = s.slice(':::premium'.length).trim()
  if (!rest) return null

  // Parse attributes: productId="xxx" sectionId="yyy"
  const productIdMatch = /productId=["']([^"']+)["']/.exec(rest)
  const sectionIdMatch = /sectionId=["']([^"']+)["']/.exec(rest)

  if (!productIdMatch || !sectionIdMatch) return null

  return {
    productId: productIdMatch[1],
    sectionId: sectionIdMatch[1],
  }
}

/**
 * Detect admonition open tokens (for nested block support)
 * e.g., ':::warning', ':::note Title', ':::type[Title]'
 */
function isAdmonitionOpen(text: string): boolean {
  const s = text.trim()
  if (!s.startsWith(':::')) return false
  if (s === ':::') return false
  // Don't count :::premium as a nested admonition
  if (/^:::premium\b/i.test(s)) return false
  return true
}

/**
 * Flatten paragraph node to plain text
 */
function flatten(p: Paragraph): string {
  let s = ''
  for (const c of p.children as any[]) {
    if (typeof (c as any).value === 'string') s += (c as any).value
  }
  return s
}

/**
 * Get premium sections data from vfile after processing
 */
export function getPremiumSectionsFromVFile(vfile: any): PremiumBlocksData['premiumSections'] {
  return vfile.data?.premiumSections || []
}
