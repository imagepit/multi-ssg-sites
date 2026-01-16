import { visit } from 'unist-util-visit'

// Transform ```files fenced blocks into <Files><Folder/><File/>...</Files>
export function remarkFilesToMdx() {
  return (tree: any) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return
      const lang = (node.lang || '').toLowerCase()
      if (lang !== 'files') return
      const value = String(node.value || '')
      const children = buildFilesAst(value)
      const filesNode = jsxEl('Files', [], children)
      parent.children[index] = filesNode
    })
  }
}

function jsxEl(name: string, attrs: { name: string; value: string }[] = [], children: any[] = []) {
  return {
    type: 'mdxJsxFlowElement',
    name,
    attributes: attrs.map((a) => ({ type: 'mdxJsxAttribute', name: a.name, value: a.value })),
    children,
    data: { _mdxExplicitJsx: true },
  }
}

function buildFilesAst(text: string): any[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/[\u2500-\u257F│├└┘┌┐┬┴├┤┼─┄┈┃╎]+/g, ' '))
    .map((l) => l.replace(/^\s*[-*]\s+/, ''))
    .filter((l) => l.trim().length > 0)

  const entries = lines.map((raw) => {
    const m = /^(\s*)(.*)$/.exec(raw)!
    const lead = m[1] || ''
    const rest = (m[2] || '').trim()
    const leadSpaces = lead.replace(/\t/g, '  ').length
    const indent = Math.floor(leadSpaces / 2)
    return { indent, label: rest }
  })

  const root: any = { children: [] }
  const stack: any[] = [root]

  for (let i = 0; i < entries.length; i++) {
    const { indent, label } = entries[i]
    const nextIndent = i + 1 < entries.length ? entries[i + 1].indent : indent
    while (stack.length - 1 > indent) stack.pop()
    const isFolder = /\/$/.test(label) || nextIndent > indent
    const name = label.replace(/\/$/, '')
    if (isFolder) {
      const folder = jsxEl('Folder', [{ name: 'name', value: name }], [])
      last(stack).children.push(folder)
      stack.push(folder)
    } else {
      const file = jsxEl('File', [{ name: 'name', value: name }], [])
      last(stack).children.push(file)
    }
  }

  return root.children
}

function last<T>(arr: T[]): T { return arr[arr.length - 1] }
