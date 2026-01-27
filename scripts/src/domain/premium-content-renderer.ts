import type { Content, Root } from 'mdast'
import { unified } from 'unified'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { rehypeCode, rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import {
  buildTechdocShikiTransformers,
  remarkAddDelRegions,
  remarkAdmonitionBlocks,
  remarkCodeTitleBeforeBlocks,
  remarkFilesToMdx,
  remarkStepBlocks,
} from '@techdoc/fumadocs-engine'

/**
 * JSX component detection result
 */
export interface JsxDetectionResult {
  hasJsx: boolean
  componentNames: string[]
}

/**
 * Detect JSX components in mdast nodes
 *
 * @param nodes - mdast Content nodes to check
 * @returns Detection result with component names
 */
export function detectJsxComponents(nodes: Content[]): JsxDetectionResult {
  const componentNames: string[] = []

  const root: Root = { type: 'root', children: nodes }

  visit(root, (node) => {
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      const name = (node as any).name || 'anonymous'
      // Allow known safe components that are transformed by our plugins
      const safeComponents = ['Callout', 'Steps', 'Step']
      if (!safeComponents.includes(name)) {
        componentNames.push(name)
      }
    }
  })

  return {
    hasJsx: componentNames.length > 0,
    componentNames,
  }
}

/**
 * Convert mdast nodes to HTML string
 *
 * Uses a minimal remark/rehype pipeline to convert markdown AST to HTML.
 * Does not support JSX/React components - use detectJsxComponents first
 * to validate that the content is pure markdown.
 *
 * @param nodes - mdast Content nodes to convert
 * @returns HTML string
 */
export async function mdastToHtml(nodes: Content[]): Promise<string> {
  const root: Root = { type: 'root', children: nodes }

  // Apply the same mdast-level transforms used by the MDX pipeline so paid
  // content can be rendered consistently (files tree, steps, admonitions, etc.).
  //
  // NOTE: order matters. remarkStepBlocks must run before remarkAdmonitionBlocks
  // because it scans raw ':::' paragraph markers (nested admonitions).
  await unified()
    .use(remarkFilesToMdx)
    .use(remarkStepBlocks)
    .use(remarkCodeTitleBeforeBlocks)
    .use(remarkAdmonitionBlocks)
    .use(remarkAddDelRegions)
    .run(root as any)

  expandTechdocMdxElements(root)

  // Fallback: if ```files is not converted for some reason, prevent shiki from
  // throwing on an unknown language.
  visit(root, 'code' as any, (node: any) => {
    if (node?.lang === 'files') node.lang = 'text'
  })

  const processor = unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCode, {
      ...(rehypeCodeDefaultOptions as any),
      transformers: [
        ...((rehypeCodeDefaultOptions as any).transformers || []),
        ...buildTechdocShikiTransformers(),
      ],
    })
    .use(rehypeStringify, { allowDangerousHtml: true })

  const result = await processor.run(root)
  const html = processor.stringify(result)

  return html
}

type MdxJsxElement = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement'
  name?: string
  attributes?: Array<{ type: string; name: string; value?: any }>
  children?: any[]
}

function expandTechdocMdxElements(root: Root) {
  ;(root as any).children = expandChildren((root as any).children || [])
}

function expandChildren(children: any[]): any[] {
  const out: any[] = []
  for (const child of children) {
    if (isMdxJsxElement(child)) {
      out.push(...expandMdxJsxElement(child))
      continue
    }

    if (Array.isArray(child?.children)) {
      child.children = expandChildren(child.children)
    }
    out.push(child)
  }
  return out
}

function isMdxJsxElement(node: any): node is MdxJsxElement {
  return node?.type === 'mdxJsxFlowElement' || node?.type === 'mdxJsxTextElement'
}

function expandMdxJsxElement(node: MdxJsxElement): any[] {
  const name = String(node.name || '')

  if (name === 'Callout') {
    const type = getJsxAttr(node, 'type') || 'info'
    const title = getJsxAttr(node, 'title')
    return wrapRaw(
      'fd-callout',
      {
        'data-type': type,
        ...(title ? { 'data-title': title } : {}),
      },
      node.children || []
    )
  }

  if (name === 'Files') {
    return wrapRaw('fd-files', {}, node.children || [])
  }
  if (name === 'Folder') {
    const folderName = getJsxAttr(node, 'name') || ''
    return wrapRaw('fd-folder', { 'data-name': folderName }, node.children || [])
  }
  if (name === 'File') {
    const fileName = getJsxAttr(node, 'name') || ''
    return wrapRaw('fd-file', { 'data-name': fileName }, [])
  }

  // fumadocs-ui Steps/Step render to <div class="fd-steps|fd-step">...</div>
  if (name === 'Steps') {
    return wrapRaw('div', { class: 'fd-steps' }, node.children || [])
  }
  if (name === 'Step') {
    return wrapRaw('div', { class: 'fd-step' }, node.children || [])
  }

  // Leave unknown JSX elements as-is so existing validation catches them.
  return [node]
}

function wrapRaw(tag: string, attrs: Record<string, string>, children: any[]): any[] {
  const open = htmlNode(`<${tag}${formatAttrs(attrs)}>` )
  const close = htmlNode(`</${tag}>`)
  return [open, ...expandChildren(children), close]
}

function htmlNode(value: string) {
  return { type: 'html', value }
}

function getJsxAttr(node: MdxJsxElement, name: string): string | undefined {
  const attrs = node.attributes || []
  const hit = attrs.find((a) => a?.name === name)
  if (!hit) return undefined
  const v = (hit as any).value
  if (typeof v === 'string') return v
  if (v == null) return undefined
  return String(v)
}

function formatAttrs(attrs: Record<string, string>): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(attrs)) {
    parts.push(` ${k}="${escapeAttr(v)}"`)
  }
  return parts.join('')
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Render premium content nodes to HTML with validation
 *
 * @param nodes - mdast Content nodes to render
 * @returns Object with html and any validation errors
 */
export async function renderPremiumContent(nodes: Content[]): Promise<{
  html: string
  errors: string[]
}> {
  const errors: string[] = []

  // Check for JSX components
  const jsxResult = detectJsxComponents(nodes)
  if (jsxResult.hasJsx) {
    errors.push(
      `JSX components are not allowed in :::premium blocks: ${jsxResult.componentNames.join(', ')}`
    )
  }

  // Convert to HTML even if there are errors (for debugging)
  const html = await mdastToHtml(nodes)

  return { html, errors }
}
