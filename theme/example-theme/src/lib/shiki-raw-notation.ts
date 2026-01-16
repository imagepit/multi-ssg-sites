import type { ShikiTransformer } from '@shikijs/types'

// General raw notation transformer for languages without line comments.
// Supports: ++, --, highlight(hl), focus, error, warning
export function transformerRawNotationDiff(): ShikiTransformer {
  const KEY = {
    add: '__raw_add_lines',
    del: '__raw_remove_lines',
    highlight: '__raw_highlight_lines',
    focus: '__raw_focus_lines',
    error: '__raw_error_lines',
    warning: '__raw_warning_lines',
  } as const

  const TOKENS = ['++', '--', 'highlight', 'hl', 'focus', 'error', 'warning'] as const
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const TOKEN_RE = new RegExp(
    `\\s*(?:<!--\\s*)?(?:\/\/|#|;|--|%|REM\\b)?\\s*\\[!code\\s+(${TOKENS.map(escapeRegExp).join('|')})(?::(\\d+))?\\]\\s*(?:-->)?\\s*$`,
    'i',
  )

  const mapToken = (t: string): 'add' | 'del' | 'highlight' | 'focus' | 'error' | 'warning' | null => {
    const k = t.toLowerCase()
    if (k === '++') return 'add'
    if (k === '--') return 'del'
    if (k === 'highlight' || k === 'hl') return 'highlight'
    if (k === 'focus') return 'focus'
    if (k === 'error') return 'error'
    if (k === 'warning') return 'warning'
    return null
  }

  return {
    name: 'raw-notation-map',
    preprocess(code) {
      const lines = code.split(/\r?\n/)
      const bag: Record<string, number[]> = {}

      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(TOKEN_RE)
        if (!m) continue
        const mode = mapToken(m[1])
        if (!mode) continue
        const span = Math.max(1, m[2] ? parseInt(m[2], 10) : 1)
        for (let j = 0; j < span && i + j < lines.length; j++) {
          const lineNo = i + 1 + j
          ;(bag[mode] ||= []).push(lineNo)
        }
        lines[i] = lines[i].replace(TOKEN_RE, '')
      }

      const meta: any = (this as any).meta || ((this as any).meta = {})
      for (const k of Object.keys(bag)) meta[(KEY as any)[k]] = Array.from(new Set(bag[k]))
      return lines.join('\n')
    },
    pre(hast) {
      const meta: any = (this as any).meta || {}
      const hasDiff = (meta[KEY.add]?.length ?? 0) > 0 || (meta[KEY.del]?.length ?? 0) > 0
      const hasHl = (meta[KEY.highlight]?.length ?? 0) > 0 || (meta[KEY.error]?.length ?? 0) > 0 || (meta[KEY.warning]?.length ?? 0) > 0
      const hasFocus = (meta[KEY.focus]?.length ?? 0) > 0
      if (hasDiff) this.addClassToHast(hast, 'has-diff')
      if (hasHl) this.addClassToHast(hast, 'has-highlighted')
      if (hasFocus) this.addClassToHast(hast, 'has-focused')
      return hast
    },
    line(hast, lineNo) {
      const meta: any = (this as any).meta || {}
      const add: number[] = meta[KEY.add] || []
      const del: number[] = meta[KEY.del] || []
      const hl: number[] = meta[KEY.highlight] || []
      const focus: number[] = meta[KEY.focus] || []
      const err: number[] = meta[KEY.error] || []
      const warn: number[] = meta[KEY.warning] || []

      if (add.includes(lineNo)) this.addClassToHast(hast, ['diff', 'add'])
      if (del.includes(lineNo)) this.addClassToHast(hast, ['diff', 'remove'])
      if (hl.includes(lineNo)) this.addClassToHast(hast, 'highlighted')
      if (focus.includes(lineNo)) this.addClassToHast(hast, 'focused')
      if (err.includes(lineNo)) this.addClassToHast(hast, ['highlighted', 'error'])
      if (warn.includes(lineNo)) this.addClassToHast(hast, ['highlighted', 'warning'])
      return hast
    },
  }
}

