import { defineConfig, defineDocs, metaSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'
import { rehypeCode, rehypeCodeDefaultOptions, remarkStructure } from 'fumadocs-core/mdx-plugins'
import { remarkAddDelRegions } from '@/lib/remark-adddel'
import { remarkFilesToMdx } from '@/lib/remark-files-to-mdx'
import { remarkStepBlocks } from '@/lib/remark-steps'
import { remarkCodeTitleBeforeBlocks } from '@/lib/remark-code-title'
import { remarkAdmonitionBlocks } from '@/lib/remark-admonition-blocks'
import { rehypeResolveImages } from '@/lib/rehype-resolve-images'
import { rehypeNextImage } from '@/lib/rehype-next-image'
import { rehypeBashClass } from '@/lib/rehype-bash-class'
import { transformerRawNotationDiff } from '@/lib/shiki-raw-notation'
import { transformerBashClass } from '@/lib/shiki-bash-transformer'

const SITE_ID = process.env.SITE_ID
const docsDir = SITE_ID ? `../../contents/${SITE_ID}/contents` : 'content'

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      cover: z.string().optional(),
      full: z.boolean().optional(),
    }),
    files: [
      '**/*.{md,mdx}',
      '!**/README.md',
      '!**/AGENTS.md',
      '!**/CLAUDE.md',
    ],
  },
  meta: { schema: metaSchema },
})

export default defineConfig({
  mdxOptions: {
    preset: 'fumadocs',
    remarkPlugins: (v) => [
      remarkFilesToMdx,
      remarkStepBlocks,
      remarkCodeTitleBeforeBlocks,
      remarkAdmonitionBlocks,
      ...v,
      remarkAddDelRegions,
      [remarkStructure, { types: ['heading','paragraph','blockquote','tableCell','mdxJsxFlowElement','code'] }],
    ],
    rehypePlugins: (v) => {
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
  },
})

