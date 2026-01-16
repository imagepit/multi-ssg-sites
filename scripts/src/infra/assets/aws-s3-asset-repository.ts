import { AssetRepository, AssetSyncInput } from '../../domain/ports/asset-repository.js'
import { CommandRunner } from '../../application/ports/command-runner.js'

export class AwsS3AssetRepository implements AssetRepository {
  constructor(private readonly runner: CommandRunner) {}

  async syncOptimizedImages(input: AssetSyncInput): Promise<void> {
    const destination = `s3://${input.bucket}/${input.prefix}`
    const args = ['s3', 'sync', input.sourceDir, destination]

    if (input.diffOnly) {
      args.push('--size-only')
    }

    args.push('--endpoint-url', input.endpoint)

    const env = {
      AWS_ACCESS_KEY_ID: input.accessKeyId,
      AWS_SECRET_ACCESS_KEY: input.secretAccessKey,
      AWS_REGION: 'auto',
      AWS_EC2_METADATA_DISABLED: 'true'
    }

    await this.runner.run('aws', args, { env, stdio: 'inherit' })
  }
}
