import {
  PaidContentRepository,
  PaidContentUploadInput,
  PaidContentStorageConfig,
} from '../../domain/ports/paid-content-repository.js'
import { CommandRunner } from '../../application/ports/command-runner.js'

/**
 * JSON structure stored in R2 for each paid section
 */
interface PaidContentJson {
  html: string
  productId: string
  sectionId: string
}

/**
 * R2/S3 implementation of PaidContentRepository
 *
 * Uses AWS CLI for S3-compatible operations with Cloudflare R2
 */
export class R2PaidContentRepository implements PaidContentRepository {
  constructor(private readonly runner: CommandRunner) {}

  async uploadSection(
    input: PaidContentUploadInput,
    config: PaidContentStorageConfig
  ): Promise<void> {
    const key = this.buildKey(input.siteId, input.slug, input.sectionId)
    const content: PaidContentJson = {
      html: input.html,
      productId: input.productId,
      sectionId: input.sectionId,
    }
    const body = JSON.stringify(content)

    const s3Uri = `s3://${config.bucket}/${key}`

    // Use aws s3 cp with stdin to upload JSON content
    const args = [
      's3',
      'cp',
      '-',
      s3Uri,
      '--content-type',
      'application/json',
      '--endpoint-url',
      config.endpoint,
    ]

    const env = this.buildEnv(config)

    await this.runner.run('aws', args, {
      env,
      input: body,
    })
  }

  async uploadSections(
    inputs: PaidContentUploadInput[],
    config: PaidContentStorageConfig
  ): Promise<void> {
    // Upload sections sequentially to avoid overwhelming the API
    for (const input of inputs) {
      await this.uploadSection(input, config)
    }
  }

  async deleteSection(
    siteId: string,
    slug: string,
    sectionId: string,
    config: PaidContentStorageConfig
  ): Promise<void> {
    const key = this.buildKey(siteId, slug, sectionId)
    const s3Uri = `s3://${config.bucket}/${key}`

    const args = [
      's3',
      'rm',
      s3Uri,
      '--endpoint-url',
      config.endpoint,
    ]

    const env = this.buildEnv(config)

    await this.runner.run('aws', args, { env })
  }

  /**
   * Build the S3 key for a paid content section
   * Format: paid/{siteId}/{slug}/{sectionId}.json
   */
  private buildKey(siteId: string, slug: string, sectionId: string): string {
    return `paid/${siteId}/${slug}/${sectionId}.json`
  }

  /**
   * Build environment variables for AWS CLI
   */
  private buildEnv(config: PaidContentStorageConfig): Record<string, string> {
    return {
      AWS_ACCESS_KEY_ID: config.accessKeyId,
      AWS_SECRET_ACCESS_KEY: config.secretAccessKey,
      AWS_REGION: 'auto',
      AWS_EC2_METADATA_DISABLED: 'true',
    }
  }
}
