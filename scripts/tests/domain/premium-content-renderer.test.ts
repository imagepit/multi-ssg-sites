import { describe, it, expect } from 'vitest'
import type { Content, Paragraph, Heading, Code } from 'mdast'
import {
  detectJsxComponents,
  mdastToHtml,
  renderPremiumContent,
} from '../../src/domain/premium-content-renderer.js'

describe('detectJsxComponents', () => {
  it('returns false for pure markdown nodes', () => {
    const nodes: Content[] = [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Hello world' }],
      } as Paragraph,
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'Title' }],
      } as Heading,
    ]

    const result = detectJsxComponents(nodes)

    expect(result.hasJsx).toBe(false)
    expect(result.componentNames).toHaveLength(0)
  })

  it('detects JSX flow elements', () => {
    const nodes: Content[] = [
      {
        type: 'mdxJsxFlowElement',
        name: 'CustomComponent',
        attributes: [],
        children: [],
      } as any,
    ]

    const result = detectJsxComponents(nodes)

    expect(result.hasJsx).toBe(true)
    expect(result.componentNames).toContain('CustomComponent')
  })

  it('allows safe components (Callout, Steps, Step)', () => {
    const nodes: Content[] = [
      {
        type: 'mdxJsxFlowElement',
        name: 'Callout',
        attributes: [],
        children: [],
      } as any,
      {
        type: 'mdxJsxFlowElement',
        name: 'Steps',
        attributes: [],
        children: [],
      } as any,
      {
        type: 'mdxJsxFlowElement',
        name: 'Step',
        attributes: [],
        children: [],
      } as any,
    ]

    const result = detectJsxComponents(nodes)

    expect(result.hasJsx).toBe(false)
    expect(result.componentNames).toHaveLength(0)
  })

  it('detects nested JSX components', () => {
    const nodes: Content[] = [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Before ' },
          {
            type: 'mdxJsxTextElement',
            name: 'InlineComponent',
            attributes: [],
            children: [],
          } as any,
          { type: 'text', value: ' after' },
        ],
      } as any,
    ]

    const result = detectJsxComponents(nodes)

    expect(result.hasJsx).toBe(true)
    expect(result.componentNames).toContain('InlineComponent')
  })
})

describe('mdastToHtml', () => {
  it('converts paragraph to HTML', async () => {
    const nodes: Content[] = [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Hello world' }],
      } as Paragraph,
    ]

    const html = await mdastToHtml(nodes)

    expect(html).toContain('<p>Hello world</p>')
  })

  it('converts heading to HTML', async () => {
    const nodes: Content[] = [
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'Title' }],
      } as Heading,
    ]

    const html = await mdastToHtml(nodes)

    expect(html).toContain('<h2>Title</h2>')
  })

  it('converts code block to HTML', async () => {
    const nodes: Content[] = [
      {
        type: 'code',
        lang: 'typescript',
        value: 'const x = 1',
      } as Code,
    ]

    const html = await mdastToHtml(nodes)

    expect(html).toContain('<pre')
    expect(html).toContain('class="shiki')
    expect(html).toContain('<code')
    expect(html).toMatch(/const[\s\S]*x[\s\S]*1/)
  })

  it('converts multiple nodes', async () => {
    const nodes: Content[] = [
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'Introduction' }],
      } as Heading,
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'This is the content.' }],
      } as Paragraph,
    ]

    const html = await mdastToHtml(nodes)

    expect(html).toContain('<h2>Introduction</h2>')
    expect(html).toContain('<p>This is the content.</p>')
  })
})

describe('renderPremiumContent', () => {
  it('renders valid content without errors', async () => {
    const nodes: Content[] = [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Premium content' }],
      } as Paragraph,
    ]

    const result = await renderPremiumContent(nodes)

    expect(result.errors).toHaveLength(0)
    expect(result.html).toContain('Premium content')
  })

  it('reports JSX component errors', async () => {
    const nodes: Content[] = [
      {
        type: 'mdxJsxFlowElement',
        name: 'CustomComponent',
        attributes: [],
        children: [],
      } as any,
    ]

    const result = await renderPremiumContent(nodes)

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('JSX components are not allowed')
    expect(result.errors[0]).toContain('CustomComponent')
  })

  it('allows Callout components', async () => {
    const nodes: Content[] = [
      {
        type: 'mdxJsxFlowElement',
        name: 'Callout',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'type', value: 'info' },
        ],
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'Note content' }],
          },
        ],
      } as any,
    ]

    const result = await renderPremiumContent(nodes)

    expect(result.errors).toHaveLength(0)
  })
})
