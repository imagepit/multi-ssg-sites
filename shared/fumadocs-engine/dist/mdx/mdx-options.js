import { rehypeCode, rehypeCodeDefaultOptions, remarkStructure, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { z } from 'zod';
import { remarkAddDelRegions } from './plugins/remark-adddel.js';
import { remarkFilesToMdx } from './plugins/remark-files-to-mdx.js';
import { remarkStepBlocks } from './plugins/remark-steps.js';
import { remarkCodeTitleBeforeBlocks } from './plugins/remark-code-title.js';
import { remarkAdmonitionBlocks } from './plugins/remark-admonition-blocks.js';
import { rehypeResolveImages } from './plugins/rehype-resolve-images.js';
import { rehypeNextImage } from './plugins/rehype-next-image.js';
import { rehypeBashClass } from './plugins/rehype-bash-class.js';
import { transformerRawNotationDiff } from './shiki/shiki-raw-notation.js';
import { transformerBashClass } from './shiki/shiki-bash-transformer.js';
const dateSchema = z.preprocess((value) => {
    if (value instanceof Date)
        return value.toISOString();
    return value;
}, z.string().optional());
export const baseFrontmatterSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: dateSchema,
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    cover: z.string().optional(),
    full: z.boolean().optional(),
});
export function buildFrontmatterSchema(extend) {
    const base = baseFrontmatterSchema;
    const extended = extend ? extend(base) : base;
    // Allow unknown keys soテーマごとの拡張が落ちないようにする
    return extended.passthrough();
}
export function buildMdxOptions() {
    return {
        preset: 'fumadocs',
        remarkPlugins: (v) => [
            remarkFilesToMdx,
            remarkStepBlocks,
            remarkCodeTitleBeforeBlocks,
            remarkAdmonitionBlocks,
            remarkMdxMermaid,
            ...v,
            remarkAddDelRegions,
            [remarkStructure, { types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'mdxJsxFlowElement', 'code'] }],
        ],
        rehypePlugins: (v) => {
            const base = Array.isArray(v) ? v : [];
            const enhanced = base.map((p) => {
                if (Array.isArray(p) && p[0] === rehypeCode) {
                    const baseOptions = (p[1] || {});
                    return [rehypeCode, {
                            ...baseOptions,
                            transformers: [
                                ...(baseOptions.transformers || rehypeCodeDefaultOptions.transformers || []),
                                transformerRawNotationDiff(),
                                transformerBashClass(),
                            ],
                        }];
                }
                if (p === rehypeCode || (typeof p === 'function' && p.name === 'rehypeCode')) {
                    return [rehypeCode, {
                            transformers: [
                                ...rehypeCodeDefaultOptions.transformers || [],
                                transformerRawNotationDiff(),
                                transformerBashClass(),
                            ],
                        }];
                }
                return p;
            });
            return [
                rehypeResolveImages,
                rehypeNextImage,
                ...enhanced,
                rehypeBashClass,
            ];
        },
    };
}
