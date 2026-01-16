import { describe, expect, it } from 'vitest'
import { SyncSearchIndexesUseCase } from '../../src/application/use-cases/sync-search-indexes.js'
import { FakeFileSystem, FakeLogger } from './fakes.js'
import { SearchIndexRepository, SearchIndexSyncInput } from '../../src/domain/ports/search-index-repository.js'

class FakeSearchIndexRepository implements SearchIndexRepository {
  calls: SearchIndexSyncInput[] = []

  async syncSearchIndexes(input: SearchIndexSyncInput): Promise<void> {
    this.calls.push(input)
  }
}

const createUseCase = (existing: string[]) => {
  const repository = new FakeSearchIndexRepository()
  const fileSystem = new FakeFileSystem(existing)
  const logger = new FakeLogger()
  return { useCase: new SyncSearchIndexesUseCase(repository, fileSystem, logger), repository }
}

describe('SyncSearchIndexesUseCase', () => {
  it('delegates to repository', async () => {
    const { useCase, repository } = createUseCase(['/indexes'])

    await useCase.execute({
      sourceDir: '/indexes',
      bucket: 'bucket',
      prefix: 'v0/search-indexes',
      endpoint: 'https://r2.example.com',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      diffOnly: true
    })

    expect(repository.calls.length).toBe(1)
    expect(repository.calls[0]?.prefix).toBe('v0/search-indexes')
  })
})
