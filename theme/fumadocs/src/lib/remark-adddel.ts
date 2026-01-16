import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

// Remark plugin: converts custom region markers into shiki notations
// - //addstart ... //addend       -> append " // [!code ++]" per line
// - //delstart ... //delend       -> append " // [!code --]" per line
// - //highlightstart ... //highlightend -> append " // [!code highlight]"
// - //focusstart ... //focusend   -> append " // [!code focus]"
// - //errorstart ... //errorend   -> append " // [!code error]"
// - //warningstart ... //warningend -> append " // [!code warning]"
// The marker lines themselves are removed.
export function remarkAddDelRegions() {
  return (tree: Root) => {
    visit(tree, 'code', (node: any) => {
      if (!node || typeof node.value !== 'string') return
      const src = node.value
      const lines = src.split('\n')

      type Mode = 'add' | 'del' | 'highlight' | 'focus' | 'error' | 'warning' | null
      let mode: Mode = null
      const out: string[] = []

      const setMode = (next: Mode) => { mode = next }
      const is = (re: RegExp, s: string) => re.test(s)

      for (const line of lines) {
        const trimmed = line.trim()

        // Region boundaries (case-insensitive)
        if (is(/^\/\/\s*addstart\s*$/i, trimmed)) { setMode('add'); continue }
        if (is(/^\/\/\s*addend\s*$/i, trimmed)) { setMode(null); continue }
        if (is(/^\/\/\s*delstart\s*$/i, trimmed)) { setMode('del'); continue }
        if (is(/^\/\/\s*delend\s*$/i, trimmed)) { setMode(null); continue }
        if (is(/^\/\/\s*highlightstart\s*$/i, trimmed)) { setMode('highlight'); continue }
        if (is(/^\/\/\s*highlightend\s*$/i, trimmed)) { setMode(null); continue }
        if (is(/^\/\/\s*focusstart\s*$/i, trimmed)) { setMode('focus'); continue }
        if (is(/^\/\/\s*focusend\s*$/i, trimmed)) { setMode(null); continue }
        if (is(/^\/\/\s*errorstart\s*$/i, trimmed)) { setMode('error'); continue }
        if (is(/^\/\/\s*errorend\s*$/i, trimmed)) { setMode(null); continue }
        if (is(/^\/\/\s*warningstart\s*$/i, trimmed)) { setMode('warning'); continue }
        if (is(/^\/\/\s*warningend\s*$/i, trimmed)) { setMode(null); continue }

        // Append notation according to current mode
        if (mode === 'add') {
          out.push(line.includes('[!code ++]') ? line : `${line} // [!code ++]`)
        } else if (mode === 'del') {
          out.push(line.includes('[!code --]') ? line : `${line} // [!code --]`)
        } else if (mode === 'highlight') {
          out.push(line.includes('[!code highlight]') ? line : `${line} // [!code highlight]`)
        } else if (mode === 'focus') {
          out.push(line.includes('[!code focus]') ? line : `${line} // [!code focus]`)
        } else if (mode === 'error') {
          out.push(line.includes('[!code error]') ? line : `${line} // [!code error]`)
        } else if (mode === 'warning') {
          out.push(line.includes('[!code warning]') ? line : `${line} // [!code warning]`)
        } else {
          out.push(line)
        }
      }

      node.value = out.join('\n')
    })
  }
}
