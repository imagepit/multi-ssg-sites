import type { Root, Code } from 'mdast'
import { visit } from 'unist-util-visit'

const BASH_LIKE = new Set(['bash', 'sh', 'shell', 'zsh'])

// Add meta to bash-like code fences so downstream rehypeCode can emit attributes on figure
// e.g., ```bash becomes figure.fd-bash via meta: class="fd-bash" data-bash="true"
export function remarkBashMeta() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      const lang = (node.lang || '').toLowerCase()
      if (!BASH_LIKE.has(lang)) return
      const inject = 'class="fd-bash" data-bash="true"'
      if (typeof node.meta === 'string' && node.meta.trim().length > 0) {
        // Avoid duplicating
        if (!node.meta.includes('fd-bash')) node.meta += ' ' + inject
      } else {
        ;(node as any).meta = inject
      }
    })
  }
}

