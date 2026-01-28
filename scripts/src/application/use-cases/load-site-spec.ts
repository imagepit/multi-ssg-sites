import path from 'node:path'
import { UseCaseError } from '../errors.js'
import { FileSystem } from '../ports/file-system.js'
import { parseSiteSpec, ParsedSiteSpec, SiteSpecData } from '../../domain/site-spec-parser.js'

export class LoadSiteSpecUseCase {
  constructor(private readonly fileSystem: FileSystem) {}

  async execute(siteId: string, rootDir: string): Promise<ParsedSiteSpec | null> {
    const specPath = path.join(rootDir, 'contents', siteId, 'specs', 'spec.json')
    if (!(await this.fileSystem.exists(specPath))) {
      return null
    }

    const raw = await this.fileSystem.read(specPath)
    let data: SiteSpecData
    try {
      data = JSON.parse(raw) as SiteSpecData
    } catch (error) {
      throw new UseCaseError(
        `Failed to parse spec.json for site "${siteId}": ${error instanceof Error ? error.message : 'unknown error'}`
      )
    }
    return parseSiteSpec(data)
  }
}
