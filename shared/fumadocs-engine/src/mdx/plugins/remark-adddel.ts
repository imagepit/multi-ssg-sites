import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

// Remark plugin: converts custom region markers into shiki notations
// Appends `[!code ...]` using language-appropriate comment syntax so Shiki can parse/strip it.
// - //addstart ... //addend       -> append `[!code ++]` per line
// - //delstart ... //delend       -> append `[!code --]` per line
// - //highlightstart ... //highlightend -> append `[!code highlight]`
// - //focusstart ... //focusend   -> append `[!code focus]`
// - //errorstart ... //errorend   -> append `[!code error]`
// - //warningstart ... //warningend -> append `[!code warning]`
// The marker lines themselves are removed.
export function remarkAddDelRegions() {
  return (tree: Root) => {
    visit(tree, 'code', (node: any) => {
      if (!node || typeof node.value !== 'string') return
      const lang = typeof node.lang === 'string' ? node.lang.toLowerCase() : ''
      const src = node.value
      const lines = src.split('\n')

      type Mode = 'add' | 'del' | 'highlight' | 'focus' | 'error' | 'warning' | null
      let mode: Mode = null
      const out: string[] = []

      const setMode = (next: Mode) => { mode = next }
      const is = (re: RegExp, s: string) => re.test(s)
      const notationSuffix = (token: string) => {
        // Use language-appropriate comment syntax so built-in Shiki transformers can strip notations.
        // (Our custom raw-notation transformer also supports these variants.)
        if (lang === 'xml' || lang === 'html' || lang === 'svg') return ` <!-- [!code ${token}] -->`
        if (lang === 'yaml' || lang === 'yml' || lang === 'toml' || lang === 'ini') return ` # [!code ${token}]`
        if (lang === 'sql' || lang === 'lua') return ` -- [!code ${token}]`
        if (lang === 'bash' || lang === 'sh' || lang === 'zsh' || lang === 'shell' || lang === 'python' || lang === 'py' || lang === 'ruby' || lang === 'rb' || lang === 'dockerfile' || lang === 'makefile') return ` # [!code ${token}]`
        return ` // [!code ${token}]`
      }

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
          out.push(line.includes('[!code ++]') ? line : `${line}${notationSuffix('++')}`)
        } else if (mode === 'del') {
          out.push(line.includes('[!code --]') ? line : `${line}${notationSuffix('--')}`)
        } else if (mode === 'highlight') {
          out.push(line.includes('[!code highlight]') ? line : `${line}${notationSuffix('highlight')}`)
        } else if (mode === 'focus') {
          out.push(line.includes('[!code focus]') ? line : `${line}${notationSuffix('focus')}`)
        } else if (mode === 'error') {
          out.push(line.includes('[!code error]') ? line : `${line}${notationSuffix('error')}`)
        } else if (mode === 'warning') {
          out.push(line.includes('[!code warning]') ? line : `${line}${notationSuffix('warning')}`)
        } else {
          out.push(line)
        }
      }

      node.value = out.join('\n')
    })
  }
}
