import type { Content, Root } from 'mdast'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { rehypeCode, rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { buildTechdocShikiTransformers } from '@techdoc/fumadocs-engine'

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

  // Transform admonition Callout JSX elements to HTML divs
  visit(root, (node, index, parent) => {
    if (
      node.type === 'mdxJsxFlowElement' &&
      (node as any).name === 'Callout'
    ) {
      const attrs = (node as any).attributes || []
      const typeAttr = attrs.find((a: any) => a.name === 'type')
      const titleAttr = attrs.find((a: any) => a.name === 'title')
      const type = typeAttr?.value || 'info'
      const title = titleAttr?.value

      // Create a simple div structure for Callout
      const children = [...(node as any).children]
      if (title) {
        children.unshift({
          type: 'paragraph',
          children: [{ type: 'strong', children: [{ type: 'text', value: title }] }],
        } as any)
      }

      const replacement: Content = {
        type: 'blockquote' as any,
        data: {
          hProperties: { className: [`callout`, `callout-${type}`] },
        },
        children,
      } as any

      if (parent && typeof index === 'number') {
        parent.children[index] = replacement
      }
    }
  })

  // Transform Steps/Step JSX elements to HTML
  visit(root, (node, index, parent) => {
    if (
      node.type === 'mdxJsxFlowElement' &&
      (node as any).name === 'Steps'
    ) {
      const replacement: Content = {
        type: 'html' as any,
        value: '',
        data: {
          hName: 'div',
          hProperties: { className: ['steps'] },
        },
        children: (node as any).children,
      } as any

      if (parent && typeof index === 'number') {
        parent.children[index] = replacement
      }
    }

    if (
      node.type === 'mdxJsxFlowElement' &&
      (node as any).name === 'Step'
    ) {
      const replacement: Content = {
        type: 'html' as any,
        value: '',
        data: {
          hName: 'div',
          hProperties: { className: ['step'] },
        },
        children: (node as any).children,
      } as any

      if (parent && typeof index === 'number') {
        parent.children[index] = replacement
      }
    }
  })

  const processor = unified()
    .use(remarkParse)
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
