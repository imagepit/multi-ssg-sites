import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { remarkAddDelRegions } from './remark-adddel.js'

const run = async (markdown: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkAddDelRegions)

  const tree = await processor.run(processor.parse(markdown))
  return tree as any
}

describe('remarkAddDelRegions', () => {
  it('should use HTML comments for xml/html fences', async () => {
    const md = [
      '```xml',
      '//addstart',
      '<div />',
      '//addend',
      '```',
      '',
    ].join('\n')

    const tree = await run(md)
    const code = tree.children.find((n: any) => n.type === 'code')
    expect(code.lang).toBe('xml')
    expect(code.value).toContain('<div /> <!-- [!code ++] -->')
    expect(code.value).not.toContain('addstart')
  })

  it('should use # comments for yaml fences', async () => {
    const md = [
      '```yaml',
      '//highlightstart',
      'services:',
      '//highlightend',
      '```',
      '',
    ].join('\n')

    const tree = await run(md)
    const code = tree.children.find((n: any) => n.type === 'code')
    expect(code.lang).toBe('yaml')
    expect(code.value).toContain('services: # [!code highlight]')
    expect(code.value).not.toContain('highlightstart')
  })
})

