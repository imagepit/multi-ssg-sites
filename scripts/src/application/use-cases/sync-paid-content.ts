import { Logger } from '../ports/logger.js'
import {
  PaidContentRepository,
  PaidContentUploadInput,
  PaidContentStorageConfig,
} from '../../domain/ports/paid-content-repository.js'

export type SyncPaidContentInput = {
  /** Site identifier (e.g., "dx-media") */
  siteId: string
  /** Array of paid content sections to upload */
  sections: Array<{
    slug: string
    sectionId: string
    productId: string
    html: string
  }>
  /** R2/S3 storage configuration */
  storage: PaidContentStorageConfig
}

export type SyncPaidContentResult = {
  /** Number of sections uploaded */
  uploadedCount: number
  /** List of uploaded section keys */
  uploadedKeys: string[]
}

/**
 * Use case for syncing paid content sections to R2 storage
 *
 * This use case is called after MDX processing to upload extracted
 * premium content sections to R2 for later retrieval via API.
 */
export class SyncPaidContentUseCase {
  constructor(
    private readonly repository: PaidContentRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: SyncPaidContentInput): Promise<SyncPaidContentResult> {
    if (input.sections.length === 0) {
      this.logger.info('No paid content sections to sync')
      return { uploadedCount: 0, uploadedKeys: [] }
    }

    this.logger.info(
      `Syncing ${input.sections.length} paid content section(s) for site: ${input.siteId}`
    )

    const uploadInputs: PaidContentUploadInput[] = input.sections.map((section) => ({
      siteId: input.siteId,
      slug: section.slug,
      sectionId: section.sectionId,
      productId: section.productId,
      html: section.html,
    }))

    await this.repository.uploadSections(uploadInputs, input.storage)

    const uploadedKeys = input.sections.map(
      (s) => `paid/${input.siteId}/${s.slug}/${s.sectionId}.json`
    )

    this.logger.info(`Successfully uploaded ${input.sections.length} paid content section(s)`)

    return {
      uploadedCount: input.sections.length,
      uploadedKeys,
    }
  }
}
