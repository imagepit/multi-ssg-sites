import { describe, it, expect, beforeEach } from 'vitest'
import { R2PaidContentRepository } from '../../../src/infra/paid-content/r2-paid-content-repository.js'
import { CommandRunner, CommandOptions, CommandResult } from '../../../src/application/ports/command-runner.js'
import { PaidContentStorageConfig, PaidContentUploadInput } from '../../../src/domain/ports/paid-content-repository.js'

class FakeCommandRunner implements CommandRunner {
  public calls: Array<{ command: string; args: string[]; options?: CommandOptions }> = []

  async run(command: string, args: string[], options?: CommandOptions): Promise<CommandResult> {
    this.calls.push({ command, args, options })
    return { exitCode: 0 }
  }
}

describe('R2PaidContentRepository', () => {
  let runner: FakeCommandRunner
  let repository: R2PaidContentRepository
  const config: PaidContentStorageConfig = {
    bucket: 'test-bucket',
    endpoint: 'https://test.r2.cloudflarestorage.com',
    accessKeyId: 'test-key-id',
    secretAccessKey: 'test-secret-key',
  }

  beforeEach(() => {
    runner = new FakeCommandRunner()
    repository = new R2PaidContentRepository(runner)
  })

  describe('uploadSection', () => {
    it('uploads a section with correct S3 key format', async () => {
      const input: PaidContentUploadInput = {
        siteId: 'dx-media',
        slug: 'intro-to-dx',
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
        html: '<h2>Premium Content</h2><p>This is paid content.</p>',
      }

      await repository.uploadSection(input, config)

      expect(runner.calls).toHaveLength(1)
      const call = runner.calls[0]

      expect(call.command).toBe('aws')
      expect(call.args).toContain('s3')
      expect(call.args).toContain('cp')
      expect(call.args).toContain('-')
      expect(call.args).toContain('s3://test-bucket/paid/dx-media/intro-to-dx/section-1.json')
      expect(call.args).toContain('--content-type')
      expect(call.args).toContain('application/json')
      expect(call.args).toContain('--endpoint-url')
      expect(call.args).toContain('https://test.r2.cloudflarestorage.com')
    })

    it('passes correct JSON content as input', async () => {
      const input: PaidContentUploadInput = {
        siteId: 'test-site',
        slug: 'test-doc',
        sectionId: 'sec-1',
        productId: 'product:test',
        html: '<p>Test content</p>',
      }

      await repository.uploadSection(input, config)

      const call = runner.calls[0]
      const body = call.options?.input
      expect(body).toBeDefined()

      const parsed = JSON.parse(body!)
      expect(parsed).toEqual({
        html: '<p>Test content</p>',
        productId: 'product:test',
        sectionId: 'sec-1',
      })
    })

    it('sets correct AWS environment variables', async () => {
      const input: PaidContentUploadInput = {
        siteId: 'site',
        slug: 'doc',
        sectionId: 'sec',
        productId: 'product:x',
        html: '',
      }

      await repository.uploadSection(input, config)

      const call = runner.calls[0]
      expect(call.options?.env).toEqual({
        AWS_ACCESS_KEY_ID: 'test-key-id',
        AWS_SECRET_ACCESS_KEY: 'test-secret-key',
        AWS_REGION: 'auto',
        AWS_EC2_METADATA_DISABLED: 'true',
      })
    })
  })

  describe('uploadSections', () => {
    it('uploads multiple sections sequentially', async () => {
      const inputs: PaidContentUploadInput[] = [
        {
          siteId: 'site',
          slug: 'doc',
          sectionId: 'sec-1',
          productId: 'product:a',
          html: '<p>Content 1</p>',
        },
        {
          siteId: 'site',
          slug: 'doc',
          sectionId: 'sec-2',
          productId: 'product:b',
          html: '<p>Content 2</p>',
        },
        {
          siteId: 'site',
          slug: 'doc',
          sectionId: 'sec-3',
          productId: 'product:c',
          html: '<p>Content 3</p>',
        },
      ]

      await repository.uploadSections(inputs, config)

      expect(runner.calls).toHaveLength(3)
      expect(runner.calls[0].args).toContain('s3://test-bucket/paid/site/doc/sec-1.json')
      expect(runner.calls[1].args).toContain('s3://test-bucket/paid/site/doc/sec-2.json')
      expect(runner.calls[2].args).toContain('s3://test-bucket/paid/site/doc/sec-3.json')
    })

    it('handles empty array', async () => {
      await repository.uploadSections([], config)
      expect(runner.calls).toHaveLength(0)
    })
  })

  describe('deleteSection', () => {
    it('deletes a section with correct S3 key', async () => {
      await repository.deleteSection('dx-media', 'intro-to-dx', 'section-1', config)

      expect(runner.calls).toHaveLength(1)
      const call = runner.calls[0]

      expect(call.command).toBe('aws')
      expect(call.args).toContain('s3')
      expect(call.args).toContain('rm')
      expect(call.args).toContain('s3://test-bucket/paid/dx-media/intro-to-dx/section-1.json')
      expect(call.args).toContain('--endpoint-url')
      expect(call.args).toContain('https://test.r2.cloudflarestorage.com')
    })

    it('sets correct AWS environment variables', async () => {
      await repository.deleteSection('site', 'doc', 'sec', config)

      const call = runner.calls[0]
      expect(call.options?.env).toEqual({
        AWS_ACCESS_KEY_ID: 'test-key-id',
        AWS_SECRET_ACCESS_KEY: 'test-secret-key',
        AWS_REGION: 'auto',
        AWS_EC2_METADATA_DISABLED: 'true',
      })
    })
  })

  describe('key format', () => {
    it('handles special characters in slug', async () => {
      const input: PaidContentUploadInput = {
        siteId: 'site',
        slug: 'docs/getting-started/installation',
        sectionId: 'step-1',
        productId: 'product:x',
        html: '',
      }

      await repository.uploadSection(input, config)

      const call = runner.calls[0]
      expect(call.args).toContain('s3://test-bucket/paid/site/docs/getting-started/installation/step-1.json')
    })
  })
})
