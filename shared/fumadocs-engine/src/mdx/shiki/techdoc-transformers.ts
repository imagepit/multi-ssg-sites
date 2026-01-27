import { transformerRawNotationDiff } from './shiki-raw-notation.js'
import { transformerBashClass } from './shiki-bash-transformer.js'

/**
 * Techdoc-wide shiki transformer set used by rehypeCode.
 *
 * Keep this list in one place so Markdown/MDX rendering stays consistent
 * across themes and paid-content HTML rendering.
 */
export function buildTechdocShikiTransformers() {
  return [
    transformerRawNotationDiff(),
    transformerBashClass(),
  ]
}

