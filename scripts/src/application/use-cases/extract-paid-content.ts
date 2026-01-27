import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { VFile } from 'vfile'
import { Logger } from '../ports/logger.js'
import { FileSystem } from '../ports/file-system.js'
import { renderPremiumContent } from '../../domain/premium-content-renderer.js'
import {
  validatePremiumSections,
  normalizeSlug,
  type RawPremiumSection,
  type ValidationError,
} from '../../domain/premium-content-validator.js'

// Import the premium blocks plugin from fumadocs-engine
// We need to use dynamic import since it's an ESM module
interface PremiumSectionData {
  sectionId: string
  productId: string
  nodes: any[]
}

export interface ExtractPaidContentInput {
  siteId: string
  contentsDir: string
}

export interface ExtractedPremiumSection {
  slug: string
  sectionId: string
  productId: string
  html: string
}

export interface ExtractPaidContentResult {
  sections: ExtractedPremiumSection[]
  errors: ValidationError[]
}

/**
 * Use case for extracting paid content sections from MDX files
 *
 * This use case:
 * 1. Scans the contents directory for .md/.mdx files
 * 2. Parses each file with remark and extracts :::premium blocks
 * 3. Converts the mdast nodes to HTML
 * 4. Validates uniqueness and slug format
 * 5. Returns the extracted sections ready for upload
 */
export class ExtractPaidContentUseCase {
  constructor(
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger
  ) {}

  async execute(input: ExtractPaidContentInput): Promise<ExtractPaidContentResult> {
    this.logger.info(`Extracting paid content from: ${input.contentsDir}`)

    // Find all MDX files
    const mdFiles = await this.findMdxFiles(input.contentsDir)
    this.logger.info(`Found ${mdFiles.length} MDX file(s)`)

    // Import the remark plugin dynamically
    const { remarkPremiumBlocks, getPremiumSectionsFromVFile } = await import(
      '@techdoc/fumadocs-engine/mdx/plugins/remark-premium-blocks'
    )

    // Process each file
    const rawSections: RawPremiumSection[] = []

    for (const filePath of mdFiles) {
      const content = await this.fileSystem.read(filePath)
      const relativePath = path.relative(input.contentsDir, filePath)
      const slug = normalizeSlug(relativePath)

      // Skip files without :::premium blocks (optimization)
      if (!content.includes(':::premium')) {
        continue
      }

      // Parse with remark and extract premium sections
      const processor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(remarkPremiumBlocks)

      const vfile = new VFile(content)

      try {
        const tree = processor.parse(vfile)
        await processor.run(tree, vfile)
      } catch (error) {
        // Log parse error and skip this file
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.logger.warn(`  ${relativePath}: Parse error - ${errorMessage}`)
        continue
      }

      const premiumSections: PremiumSectionData[] = getPremiumSectionsFromVFile(vfile)

      if (premiumSections.length > 0) {
        this.logger.info(`  ${relativePath}: ${premiumSections.length} premium section(s)`)
      }

      // Convert each section's nodes to HTML
      for (const section of premiumSections) {
        const { html, errors: renderErrors } = await renderPremiumContent(section.nodes)

        rawSections.push({
          file: relativePath,
          slug,
          sectionId: section.sectionId,
          productId: section.productId,
          html,
          jsxErrors: renderErrors.length > 0 ? renderErrors : undefined,
        })
      }
    }

    // Validate all sections
    const validationResult = validatePremiumSections(rawSections)

    if (validationResult.errors.length > 0) {
      this.logger.warn(`Found ${validationResult.errors.length} validation error(s)`)
      for (const error of validationResult.errors) {
        this.logger.warn(`  ${error.file}: ${error.message}`)
      }
    }

    this.logger.info(
      `Extracted ${validationResult.sections.length} valid premium section(s)`
    )

    return {
      sections: validationResult.sections,
      errors: validationResult.errors,
    }
  }

  private async findMdxFiles(dir: string): Promise<string[]> {
    const results: string[] = []

    const dirExists = await this.fileSystem.exists(dir)
    if (!dirExists) {
      return results
    }

    const entries = await this.fileSystem.readdir(dir)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = await this.fileSystem.stat(fullPath)

      if (stat.isDirectory()) {
        const nested = await this.findMdxFiles(fullPath)
        results.push(...nested)
      } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
        results.push(fullPath)
      }
    }

    return results
  }
}
