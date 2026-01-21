import { describe, it, expect, beforeEach } from 'vitest'
import { SyncPaidContentUseCase, SyncPaidContentInput } from '../../src/application/use-cases/sync-paid-content.js'
import { FakeLogger, FakePaidContentRepository } from './fakes.js'
import { PaidContentStorageConfig } from '../../src/domain/ports/paid-content-repository.js'

describe('SyncPaidContentUseCase', () => {
  let repository: FakePaidContentRepository
  let logger: FakeLogger
  let useCase: SyncPaidContentUseCase

  const storageConfig: PaidContentStorageConfig = {
    bucket: 'test-bucket',
    endpoint: 'https://test.r2.cloudflarestorage.com',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
  }

  beforeEach(() => {
    repository = new FakePaidContentRepository()
    logger = new FakeLogger()
    useCase = new SyncPaidContentUseCase(repository, logger)
  })

  it('uploads paid content sections to repository', async () => {
    const input: SyncPaidContentInput = {
      siteId: 'dx-media',
      sections: [
        {
          slug: 'intro-to-dx',
          sectionId: 'section-1',
          productId: 'product:course-dx',
          html: '<h2>Premium</h2><p>Content</p>',
        },
        {
          slug: 'intro-to-dx',
          sectionId: 'section-2',
          productId: 'product:course-dx',
          html: '<h2>More Premium</h2><p>More Content</p>',
        },
      ],
      storage: storageConfig,
    }

    const result = await useCase.execute(input)

    expect(result.uploadedCount).toBe(2)
    expect(result.uploadedKeys).toEqual([
      'paid/dx-media/intro-to-dx/section-1.json',
      'paid/dx-media/intro-to-dx/section-2.json',
    ])

    expect(repository.uploadSectionsCalls).toHaveLength(1)
    const call = repository.uploadSectionsCalls[0]
    expect(call.inputs).toHaveLength(2)
    expect(call.inputs[0]).toEqual({
      siteId: 'dx-media',
      slug: 'intro-to-dx',
      sectionId: 'section-1',
      productId: 'product:course-dx',
      html: '<h2>Premium</h2><p>Content</p>',
    })
    expect(call.config).toEqual(storageConfig)
  })

  it('handles empty sections array', async () => {
    const input: SyncPaidContentInput = {
      siteId: 'dx-media',
      sections: [],
      storage: storageConfig,
    }

    const result = await useCase.execute(input)

    expect(result.uploadedCount).toBe(0)
    expect(result.uploadedKeys).toEqual([])
    expect(repository.uploadSectionsCalls).toHaveLength(0)
    expect(logger.infoMessages).toContain('No paid content sections to sync')
  })

  it('logs progress messages', async () => {
    const input: SyncPaidContentInput = {
      siteId: 'test-site',
      sections: [
        {
          slug: 'doc',
          sectionId: 'sec-1',
          productId: 'product:test',
          html: '<p>Test</p>',
        },
      ],
      storage: storageConfig,
    }

    await useCase.execute(input)

    expect(logger.infoMessages).toContainEqual(
      expect.stringContaining('Syncing 1 paid content section(s) for site: test-site')
    )
    expect(logger.infoMessages).toContainEqual(
      expect.stringContaining('Successfully uploaded 1 paid content section(s)')
    )
  })

  it('handles sections from multiple documents', async () => {
    const input: SyncPaidContentInput = {
      siteId: 'site',
      sections: [
        { slug: 'doc-a', sectionId: 'sec-1', productId: 'product:a', html: '<p>A1</p>' },
        { slug: 'doc-a', sectionId: 'sec-2', productId: 'product:a', html: '<p>A2</p>' },
        { slug: 'doc-b', sectionId: 'sec-1', productId: 'product:b', html: '<p>B1</p>' },
      ],
      storage: storageConfig,
    }

    const result = await useCase.execute(input)

    expect(result.uploadedCount).toBe(3)
    expect(result.uploadedKeys).toEqual([
      'paid/site/doc-a/sec-1.json',
      'paid/site/doc-a/sec-2.json',
      'paid/site/doc-b/sec-1.json',
    ])
  })
})
