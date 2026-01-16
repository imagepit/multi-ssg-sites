import { describe, expect, it } from 'vitest'
import { SyncAssetsUseCase } from '../../src/application/use-cases/sync-assets.js'
import { FakeAssetRepository, FakeFileSystem, FakeLogger } from './fakes.js'

const createUseCase = (existing: string[]) => {
  const assets = new FakeAssetRepository()
  const fileSystem = new FakeFileSystem(existing)
  const logger = new FakeLogger()
  return { useCase: new SyncAssetsUseCase(assets, fileSystem, logger), assets }
}

describe('SyncAssetsUseCase', () => {
  it('delegates to repository', async () => {
    const { useCase, assets } = createUseCase(['/assets'])

    await useCase.execute({
      sourceDir: '/assets',
      bucket: 'bucket',
      prefix: 'v0/nextImageExportOptimizer',
      endpoint: 'https://r2.example.com',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      diffOnly: true
    })

    expect(assets.calls.length).toBe(1)
    expect(assets.calls[0]?.bucket).toBe('bucket')
    expect(assets.calls[0]?.diffOnly).toBe(true)
  })
})
