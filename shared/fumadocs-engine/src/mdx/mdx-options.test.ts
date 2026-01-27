import { describe, it, expect } from 'vitest'
import { buildMdxOptions } from './mdx-options.js'

describe('buildMdxOptions', () => {
  it('should enhance rehypeCode tuple by function name', () => {
    function rehypeCode() {}
    const options = buildMdxOptions()

    const plugins = options.rehypePlugins([
      [rehypeCode, { transformers: [] }],
    ])

    const tuple = plugins.find((p: any) => Array.isArray(p) && p[0] === rehypeCode)
    expect(tuple).toBeDefined()

    const transformers = tuple[1].transformers as any[]
    expect(transformers.some((t) => t?.name === 'raw-notation-map')).toBe(true)
  })
})

