import { describe, expect, it, afterEach } from 'vitest'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { loadEnvFile } from '../../src/infra/env/dotenv-loader.js'

const envKey = 'TECHDOC_TEST_ENV'

const cleanup = async (dir?: string) => {
  delete process.env[envKey]
  if (dir) {
    await fs.rm(dir, { recursive: true, force: true })
  }
}

afterEach(async () => {
  await cleanup()
})

describe('loadEnvFile', () => {
  it('loads env values from .env when present', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'techdoc-env-'))
    await fs.writeFile(path.join(dir, '.env'), `${envKey}=fromfile\n`, 'utf8')

    loadEnvFile(dir)

    expect(process.env[envKey]).toBe('fromfile')
    await cleanup(dir)
  })

  it('does not override existing env values', async () => {
    process.env[envKey] = 'existing'
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'techdoc-env-'))
    await fs.writeFile(path.join(dir, '.env'), `${envKey}=fromfile\n`, 'utf8')

    loadEnvFile(dir)

    expect(process.env[envKey]).toBe('existing')
    await cleanup(dir)
  })
})
