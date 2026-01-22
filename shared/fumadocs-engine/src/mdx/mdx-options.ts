import { rehypeCode, rehypeCodeDefaultOptions, remarkStructure, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'
import { z } from 'zod'
import { remarkAddDelRegions } from './plugins/remark-adddel.js'
import { remarkFilesToMdx } from './plugins/remark-files-to-mdx.js'
import { remarkStepBlocks } from './plugins/remark-steps.js'
import { remarkCodeTitleBeforeBlocks } from './plugins/remark-code-title.js'
import { remarkAdmonitionBlocks } from './plugins/remark-admonition-blocks.js'
import { remarkPremiumBlocks } from './plugins/remark-premium-blocks.js'
import { rehypeResolveImages } from './plugins/rehype-resolve-images.js'
import { rehypeNextImage } from './plugins/rehype-next-image.js'
import { rehypeBashClass } from './plugins/rehype-bash-class.js'
import { transformerRawNotationDiff } from './shiki/shiki-raw-notation.js'
import { transformerBashClass } from './shiki/shiki-bash-transformer.js'

const dateSchema = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString()
  return value
}, z.string().optional())

/**
 * Sale schema for time-limited discounts
 */
export const saleSchema = z.object({
  /** Sale price in JPY */
  price: z.number(),
  /** Sale start time (ISO 8601) */
  starts_at: z.string(),
  /** Sale end time (ISO 8601) */
  ends_at: z.string(),
  /** Sale label (default: "セール中") */
  label: z.string().optional(),
})

/**
 * Product schema for paid content
 */
export const productSchema = z.object({
  /** Product identifier (e.g., "product:course-dx-intro") */
  id: z.string(),
  /** Optional price in JPY */
  price: z.number().optional(),
  /** Optional description */
  description: z.string().optional(),
  /** Optional sale configuration */
  sale: saleSchema.optional(),
})

export const baseFrontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: dateSchema,
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  cover: z.string().optional(),
  full: z.boolean().optional(),
  /** Whether this content has paid sections */
  paid: z.boolean().optional(),
  /** Products associated with paid content in this document */
  products: z.array(productSchema).optional(),
})

export type FrontmatterSchemaBuilder = (base: typeof baseFrontmatterSchema) => ReturnType<typeof baseFrontmatterSchema.extend> | typeof baseFrontmatterSchema

export function buildFrontmatterSchema(extend?: FrontmatterSchemaBuilder) {
  const base = baseFrontmatterSchema
  const extended = extend ? extend(base) : base
  // Allow unknown keys soテーマごとの拡張が落ちないようにする
  return extended.passthrough()
}

export function buildMdxOptions() {
  return {
    preset: 'fumadocs',
    remarkPlugins: (v: any) => [
      remarkFilesToMdx,
      remarkStepBlocks,
      remarkCodeTitleBeforeBlocks,
      // remarkPremiumBlocks must run BEFORE remarkAdmonitionBlocks
      // to prevent :::premium from being treated as a Callout
      remarkPremiumBlocks,
      remarkAdmonitionBlocks,
      remarkMdxMermaid,
      ...v,
      remarkAddDelRegions,
      [remarkStructure, { types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'mdxJsxFlowElement', 'code'] }],
    ],
    rehypePlugins: (v: any) => {
      const base = Array.isArray(v) ? v : []
      const enhanced = base.map((p: any) => {
        if (Array.isArray(p) && p[0] === rehypeCode) {
          const baseOptions = (p[1] || {}) as any
          return [rehypeCode, {
            ...baseOptions,
            transformers: [
              ...(baseOptions.transformers || (rehypeCodeDefaultOptions as any).transformers || []),
              transformerRawNotationDiff(),
              transformerBashClass(),
            ],
          }]
        }
        if (p === rehypeCode || (typeof p === 'function' && p.name === 'rehypeCode')) {
          return [rehypeCode, {
            transformers: [
              ...(rehypeCodeDefaultOptions as any).transformers || [],
              transformerRawNotationDiff(),
              transformerBashClass(),
            ],
          }]
        }
        return p
      })
      return [
        rehypeResolveImages,
        rehypeNextImage,
        ...enhanced,
        rehypeBashClass,
      ]
    },
  }
}
