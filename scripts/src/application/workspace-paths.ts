import path from 'node:path'
import { SiteId } from '../domain/value-objects/site-id.js'
import { ThemeId } from '../domain/value-objects/theme-id.js'

export class WorkspacePaths {
  constructor(private readonly rootDir: string) {}

  themeDir(themeId: ThemeId): string {
    return path.join(this.rootDir, 'theme', themeId.toString())
  }

  themeOutputDir(themeId: ThemeId): string {
    return path.join(this.themeDir(themeId), 'out')
  }

  optimizedImagesDir(themeId: ThemeId): string {
    return path.join(this.themeOutputDir(themeId), 'nextImageExportOptimizer')
  }

  searchIndexesDir(themeId: ThemeId): string {
    return path.join(this.themeOutputDir(themeId), 'search-indexes')
  }

  contentsDir(siteId: SiteId): string {
    return path.join(this.rootDir, 'contents', siteId.toString(), 'contents')
  }
}
