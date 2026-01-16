import { visit } from 'unist-util-visit'

// For pure Markdown pipeline, turn ```files into plain text to avoid Shiki errors
export function remarkFilesAsPlainText() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if ((node.lang || '').toLowerCase() === 'files') {
        node.lang = 'text'
      }
    })
  }
}

