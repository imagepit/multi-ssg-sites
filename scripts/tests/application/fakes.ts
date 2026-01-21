import { CommandOptions, CommandRunner } from '../../src/application/ports/command-runner.js'
import { DependencyInstaller, DependencyInstallOptions } from '../../src/application/ports/dependency-installer.js'
import { FileSystem } from '../../src/application/ports/file-system.js'
import { Logger } from '../../src/application/ports/logger.js'
import { AssetRepository, AssetSyncInput } from '../../src/domain/ports/asset-repository.js'
import {
  PaidContentRepository,
  PaidContentUploadInput,
  PaidContentStorageConfig,
} from '../../src/domain/ports/paid-content-repository.js'

export class FakeCommandRunner implements CommandRunner {
  calls: Array<{ command: string; args: string[]; options?: CommandOptions }> = []

  async run(command: string, args: string[], options?: CommandOptions) {
    this.calls.push({ command, args, options })
    return { exitCode: 0 }
  }
}

export class FakeFileSystem implements FileSystem {
  private readonly existing = new Set<string>()
  removed: string[] = []

  constructor(paths: string[] = []) {
    paths.forEach((path) => this.existing.add(path))
  }

  async exists(path: string): Promise<boolean> {
    return this.existing.has(path)
  }

  async remove(path: string): Promise<void> {
    this.removed.push(path)
  }

  add(path: string) {
    this.existing.add(path)
  }
}

export class FakeInstaller implements DependencyInstaller {
  calls: DependencyInstallOptions[] = []

  async install(options: DependencyInstallOptions): Promise<void> {
    this.calls.push(options)
  }
}

export class FakeLogger implements Logger {
  infoMessages: string[] = []
  warnMessages: string[] = []
  errorMessages: string[] = []

  info(message: string): void {
    this.infoMessages.push(message)
  }

  warn(message: string): void {
    this.warnMessages.push(message)
  }

  error(message: string): void {
    this.errorMessages.push(message)
  }
}

export class FakeAssetRepository implements AssetRepository {
  calls: AssetSyncInput[] = []

  async syncOptimizedImages(input: AssetSyncInput): Promise<void> {
    this.calls.push(input)
  }
}

export class FakePaidContentRepository implements PaidContentRepository {
  uploadCalls: Array<{ input: PaidContentUploadInput; config: PaidContentStorageConfig }> = []
  uploadSectionsCalls: Array<{ inputs: PaidContentUploadInput[]; config: PaidContentStorageConfig }> = []
  deleteCalls: Array<{ siteId: string; slug: string; sectionId: string; config: PaidContentStorageConfig }> = []

  async uploadSection(input: PaidContentUploadInput, config: PaidContentStorageConfig): Promise<void> {
    this.uploadCalls.push({ input, config })
  }

  async uploadSections(inputs: PaidContentUploadInput[], config: PaidContentStorageConfig): Promise<void> {
    this.uploadSectionsCalls.push({ inputs, config })
  }

  async deleteSection(siteId: string, slug: string, sectionId: string, config: PaidContentStorageConfig): Promise<void> {
    this.deleteCalls.push({ siteId, slug, sectionId, config })
  }
}
