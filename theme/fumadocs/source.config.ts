import { defineConfig, defineDocs, metaSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'
import { rehypeCode, rehypeCodeDefaultOptions, remarkStructure, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'
// custom remark/rehype plugins (ported from main app)
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
import { remarkLinkCard } from '@techdoc/fumadocs-engine'

// SITE_ID が指定されている場合は、ワークスペース直下の contents/[site]/contents を参照する
// 未指定時は、このプロジェクト直下のサンプル content/ を参照
const SITE_ID = process.env.SITE_ID
// サイト指定時は contents/[site]/contents をルートにする（スラッグから contents/ を除外）
const docsDir = SITE_ID ? `../../contents/${SITE_ID}/contents` : 'content'

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    // 取り込み用のMD（.rules/docpage/** など）も通せるように緩めのスキーマ
    schema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      full: z.boolean().optional(),
    }),
    // 不要ファイル除外（README/AGENTS/CLAUDE など）
    files: [
      '**/*.{md,mdx}',
      '!**/README.md',
      '!**/AGENTS.md',
      '!**/CLAUDE.md',
    ],
    // processed ではなく plain を使用するため無効化に戻す
    // postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: metaSchema },
})

export default defineConfig({
  mdxOptions: {
    preset: 'fumadocs',
    remarkPlugins: (v) => [
      // remarkLinkCard runs early before other plugins affect the tree
      remarkLinkCard,
      // before default plugins
      remarkFilesToMdx,
      remarkStepBlocks,
      remarkCodeTitleBeforeBlocks,
      remarkAdmonitionBlocks,
      remarkMdxMermaid,
      ...v,
      // after default plugins
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
