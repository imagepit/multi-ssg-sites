import { describe, expect, it } from 'vitest'
import { createPageMeta } from '../../src/domain/pages/page-meta.js'

describe('createPageMeta', () => {
  it('normalizes path and status', () => {
    const page = createPageMeta(
      {
        path: 'app-assembly',
        slug: 'app-assembly',
        title: 'App Assembly',
        status: 'publish'
      },
      'v0'
    )

    expect(page.path).toBe('/app-assembly')
    expect(page.status).toBe('published')
  })

  it('stores metadata when provided', () => {
    const page = createPageMeta(
      {
        path: '/app-assembly',
        slug: 'app-assembly',
        title: 'App Assembly',
        metadata: { parent: '', filePath: 'app-assembly/app-assembly' }
      },
      'v0'
    )

    expect(page.metadata).toEqual({ parent: '', filePath: 'app-assembly/app-assembly' })
  })
})
