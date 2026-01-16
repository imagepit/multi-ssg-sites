import type { Root, Paragraph, Text } from 'mdast'
import { visit } from 'unist-util-visit'

// remark plugin to support `:::type Title` syntax by converting it to `:::type[Title]`
// The default remarkAdmonition expects brackets around title.
export function remarkAdmonitionTitle() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph) => {
      const raw = getText(node)
      if (!raw) return
      const text = raw.trim()
      // Already bracketed -> skip
      if (/^:::[^\[]+\[[^\]]*\]\s*$/u.test(text)) return
      // Allow hyphen in type name (e.g. speech-left), capture title after first whitespace
      const m = /^:::([A-Za-z0-9_-]+)\s+(.+)$/u.exec(text)
      if (!m) return
      const [, type, title] = m
      const replaced = `:::${type}[${title.trim()}]`
      node.children = [{ type: 'text', value: replaced } as Text]
    })
  }
}

function getText(node: Paragraph): string {
  let out = ''
  for (const child of node.children) {
    if ('value' in (child as any)) out += (child as any).value
  }
  return out
}
