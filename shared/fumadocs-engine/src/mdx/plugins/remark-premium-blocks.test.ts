import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { VFile } from 'vfile'
import { remarkPremiumBlocks, getPremiumSectionsFromVFile } from './remark-premium-blocks.ts'

// Helper to process markdown and get result
async function processMarkdown(markdown: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkPremiumBlocks)

  const vfile = new VFile(markdown)
  const tree = processor.parse(vfile)
  await processor.run(tree, vfile)

  return { tree, vfile, sections: getPremiumSectionsFromVFile(vfile) }
}

// Helper to find nodes by type
function findNodes(tree: any, type: string): any[] {
  const results: any[] = []
  function walk(node: any) {
    if (node.type === type) results.push(node)
    if (node.children) node.children.forEach(walk)
  }
  walk(tree)
  return results
}

describe('remarkPremiumBlocks', () => {
  describe('basic parsing', () => {
    it('extracts a simple premium block', async () => {
      const markdown = `
# Title

:::premium productId="product:course-dx" sectionId="section-1"

This is premium content.

:::

Free content after.
`.trim()

      const { sections, tree } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].productId).toBe('product:course-dx')
      expect(sections[0].sectionId).toBe('section-1')
      expect(sections[0].nodes).toHaveLength(1)
      expect(sections[0].nodes[0].type).toBe('paragraph')
    })

    it('creates a placeholder element', async () => {
      const markdown = `
:::premium productId="product:test" sectionId="sec-1"

Premium text.

:::
`.trim()

      const { tree } = await processMarkdown(markdown)

      const placeholders = findNodes(tree, 'mdxJsxFlowElement')
      expect(placeholders).toHaveLength(1)
      expect(placeholders[0].name).toBe('PremiumPlaceholder')

      const attrs = placeholders[0].attributes
      expect(attrs).toContainEqual(
        expect.objectContaining({ name: 'sectionId', value: 'sec-1' })
      )
      expect(attrs).toContainEqual(
        expect.objectContaining({ name: 'productId', value: 'product:test' })
      )
    })

    it('handles attributes in different order', async () => {
      const markdown = `
:::premium sectionId="sec-first" productId="product:reversed"

Content.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].sectionId).toBe('sec-first')
      expect(sections[0].productId).toBe('product:reversed')
    })

    it('handles single-quoted attributes', async () => {
      const markdown = `
:::premium productId='product:single' sectionId='section-single'

Content.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].productId).toBe('product:single')
      expect(sections[0].sectionId).toBe('section-single')
    })
  })

  describe('multiple premium blocks', () => {
    it('extracts multiple premium blocks in sequence', async () => {
      const markdown = `
# Introduction

Free content.

:::premium productId="product:a" sectionId="section-a"

Premium A content.

:::

More free content.

:::premium productId="product:b" sectionId="section-b"

Premium B content.

:::

End of document.
`.trim()

      const { sections, tree } = await processMarkdown(markdown)

      expect(sections).toHaveLength(2)
      expect(sections[0].sectionId).toBe('section-a')
      expect(sections[1].sectionId).toBe('section-b')

      const placeholders = findNodes(tree, 'mdxJsxFlowElement')
      expect(placeholders.filter(p => p.name === 'PremiumPlaceholder')).toHaveLength(2)
    })
  })

  describe('content extraction', () => {
    it('extracts multiple paragraphs', async () => {
      const markdown = `
:::premium productId="product:multi" sectionId="multi-para"

First paragraph.

Second paragraph.

Third paragraph.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].nodes.length).toBe(3)
      expect(sections[0].nodes.every(n => n.type === 'paragraph')).toBe(true)
    })

    it('extracts headings inside premium blocks', async () => {
      const markdown = `
:::premium productId="product:heading" sectionId="with-heading"

## Premium Section

Content under heading.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      const headings = sections[0].nodes.filter((n: any) => n.type === 'heading')
      expect(headings).toHaveLength(1)
    })

    it('extracts code blocks inside premium blocks', async () => {
      const markdown = `
:::premium productId="product:code" sectionId="with-code"

\`\`\`typescript
const premium = true
\`\`\`

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      const codeBlocks = sections[0].nodes.filter((n: any) => n.type === 'code')
      expect(codeBlocks).toHaveLength(1)
    })
  })

  describe('nested blocks support', () => {
    it('handles nested admonitions inside premium blocks', async () => {
      const markdown = `
:::premium productId="product:nested" sectionId="nested-admonition"

Some premium content.

:::note

This is a note inside premium.

:::

More premium content.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].nodes.length).toBeGreaterThan(2)
    })
  })

  describe('edge cases', () => {
    it('ignores unclosed premium blocks', async () => {
      const markdown = `
:::premium productId="product:unclosed" sectionId="unclosed"

This block is never closed.

Some more content.
`.trim()

      const { sections, tree } = await processMarkdown(markdown)

      expect(sections).toHaveLength(0)
      const placeholders = findNodes(tree, 'mdxJsxFlowElement')
      expect(placeholders.filter(p => p.name === 'PremiumPlaceholder')).toHaveLength(0)
    })

    it('ignores premium tag without required attributes', async () => {
      const markdown = `
:::premium productId="product:only"

Missing sectionId.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(0)
    })

    it('ignores premium tag without productId', async () => {
      const markdown = `
:::premium sectionId="only-section"

Missing productId.

:::
`.trim()

      const { sections } = await processMarkdown(markdown)

      expect(sections).toHaveLength(0)
    })

    it('handles empty premium block', async () => {
      // Note: Markdown requires an empty line between the open and close tags
      // for them to be parsed as separate paragraphs
      const markdown = `
:::premium productId="product:empty" sectionId="empty-section"

:::
`.trim()

      const { sections, tree } = await processMarkdown(markdown)

      expect(sections).toHaveLength(1)
      expect(sections[0].nodes).toHaveLength(0)

      const placeholders = findNodes(tree, 'mdxJsxFlowElement')
      expect(placeholders.filter(p => p.name === 'PremiumPlaceholder')).toHaveLength(1)
    })

    it('preserves content outside premium blocks', async () => {
      const markdown = `
# Free Title

Free paragraph before.

:::premium productId="product:test" sectionId="sec-1"

Premium content.

:::

Free paragraph after.
`.trim()

      const { tree } = await processMarkdown(markdown)

      const headings = findNodes(tree, 'heading')
      expect(headings).toHaveLength(1)

      const paragraphs = findNodes(tree, 'paragraph')
      // Should have "Free paragraph before" and "Free paragraph after"
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    })
  })
})
