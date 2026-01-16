import type { ShikiTransformer } from 'shiki'

const BASH_LIKE = new Set(['bash', 'sh', 'shell', 'zsh'])

/**
 * Add fd-bash class to bash code blocks
 * This transformer works with shiki transformers
 */
export function transformerBashClass(): ShikiTransformer {
  return {
    name: 'bash-class',
    preprocess(code, options) {
      const lang = (options?.lang || '').toLowerCase()
      // console.log('Preprocessing - lang:', lang)
      return code
    },
    pre(hast) {
      // Get language from options
      const lang = (this.options?.lang || '').toLowerCase()
      const meta = (this as any).meta || {}

      // console.log('Transformer pre - lang:', lang, 'hast:', hast)

      if (BASH_LIKE.has(lang)) {
        // Add class to the pre element
        // console.log('Adding fd-bash class to bash code block (pre element)')
        this.addClassToHast(hast, 'fd-bash')
        // Also add data-bash attribute
        hast.properties = hast.properties || {}
        hast.properties['data-bash'] = 'true'
        hast.properties['data-language'] = lang
      }

      return hast
    },
    postprocess(html, options) {
      const lang = (options?.lang || '').toLowerCase()

      if (BASH_LIKE.has(lang)) {
        // console.log('Postprocessing bash block')
        // Add a wrapper class that can be targeted by CSS
        // Since we can't modify the figure directly, we'll add a marker to the pre
        return html
      }

      return html
    }
  }
}