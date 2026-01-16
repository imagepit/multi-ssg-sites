import { defineConfig, defineDocs, metaSchema } from 'fumadocs-mdx/config'
import { z } from 'zod'
import { buildFrontmatterSchema, buildMdxOptions } from '@techdoc/fumadocs-engine'

// SITE_ID が指定されている場合は、ワークスペース直下の contents/[site]/contents を参照する
// 未指定時は、このプロジェクト直下のサンプル content/ を参照
const SITE_ID = process.env.SITE_ID
// サイト指定時は contents/[site]/contents をルートにする（スラッグから contents/ を除外）
const docsDir = SITE_ID ? `../../contents/${SITE_ID}/contents` : 'content'

const docsSchema = buildFrontmatterSchema((base) =>
  base.extend({
    icon: z.string().optional(),
  }),
)

export const docs = defineDocs({
  dir: docsDir,
  docs: {
    schema: docsSchema,
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
  mdxOptions: buildMdxOptions(),
})
