/**
 * Input for uploading a single paid content section
 */
export interface PaidContentUploadInput {
  /** Site identifier (e.g., "dx-media") */
  siteId: string
  /** Document slug (e.g., "intro-to-dx") */
  slug: string
  /** Section identifier within the document (e.g., "section-1") */
  sectionId: string
  /** Product ID for access control (e.g., "product:course-dx-intro") */
  productId: string
  /** Rendered HTML content of the premium section */
  html: string
}

/**
 * R2/S3 connection configuration for paid content storage
 */
export interface PaidContentStorageConfig {
  bucket: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
}

/**
 * Repository interface for managing paid content in R2/S3 storage
 *
 * Paid content is stored at: paid/{siteId}/{slug}/{sectionId}.json
 */
export interface PaidContentRepository {
  /**
   * Upload a paid content section to storage
   * @param input - The content to upload
   * @param config - Storage connection configuration
   */
  uploadSection(input: PaidContentUploadInput, config: PaidContentStorageConfig): Promise<void>

  /**
   * Upload multiple paid content sections
   * @param inputs - Array of content sections to upload
   * @param config - Storage connection configuration
   */
  uploadSections(inputs: PaidContentUploadInput[], config: PaidContentStorageConfig): Promise<void>

  /**
   * Delete a paid content section from storage
   * @param siteId - Site identifier
   * @param slug - Document slug
   * @param sectionId - Section identifier
   * @param config - Storage connection configuration
   */
  deleteSection(siteId: string, slug: string, sectionId: string, config: PaidContentStorageConfig): Promise<void>
}
