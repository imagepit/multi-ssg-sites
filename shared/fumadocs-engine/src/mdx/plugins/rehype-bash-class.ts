import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * Add fd-bash class to bash code blocks
 * This works directly with the hast tree after shiki has processed the code
 */
export function rehypeBashClass() {
  return (tree: Root) => {
    let figureCount = 0
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'figure') {
        figureCount++
        // Add the fd-bash class for testing to ALL code blocks
        node.properties.className = node.properties.className || []
        if (Array.isArray(node.properties.className)) {
          // Temporarily add to all for debugging
          node.properties.className.push('fd-bash-debug')
        }
      }
    })
  }
}