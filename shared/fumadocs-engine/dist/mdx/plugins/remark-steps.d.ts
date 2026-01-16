import type { Root, Content, Paragraph, Heading } from 'mdast'
import { visit } from 'unist-util-visit'

// Transform custom :::step ... ::: blocks into
// <Steps><Step><h3>title</h3> ...</Step>...</Steps>
export function remarkStepBlocks() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!parent || typeof index !== 'number') return
      if (node.type !== 'paragraph') return

      const text = flatten(node as Paragraph)
      if (text.trim() !== ':::step') return

      // find closing ::: (support nested admonitions inside step)
      let end = -1
      let depth = 0
      for (let i = index + 1; i < parent.children.length; i++) {
        const n = parent.children[i]
        if (n.type === 'paragraph') {
          const t = flatten(n as Paragraph).trim()
          if (isAdmonitionOpen(t)) {
            depth++
            continue
          }
          if (t === ':::') {
            if (depth > 0) {
              depth--
              continue
            }
            end = i
            break
          }
        }
      }
      if (end === -1) return

      const region = parent.children.slice(index + 1, end)
      const steps = buildSteps(region)
      if (steps.length === 0) return
      const stepsElement: Content = {
        type: 'mdxJsxFlowElement' as any,
        name: 'Steps',
        attributes: [],
        children: steps,
      } as any

      // replace only when we have at least 1 step
      parent.children.splice(index, end - index + 1, stepsElement)

      // tell visitor to continue after inserted node
      return index
    })
  }
}

function buildSteps(nodes: Content[]): Content[] {
  const steps: Content[] = []
  let curTitle: string | null = null
  let curBody: Content[] = []
  let lastStep: any = null

  const flush = () => {
    if (!curTitle && curBody.length === 0) return
    const children: Content[] = []
    if (curTitle) {
      children.push({ type: 'heading', depth: 3, children: [{ type: 'text', value: curTitle }] } as any)
    }
    children.push(...curBody)
    const node = {
      type: 'mdxJsxFlowElement' as any,
      name: 'Step',
      attributes: [],
      children,
    } as any
    steps.push(node)
    lastStep = node
    curTitle = null
    curBody = []
  }

  for (const n of nodes) {
    if ((n as any).type === 'list' && (n as any).ordered) {
      // finalize current step before expanding the list
      flush()
      const list: any = n
      for (const li of list.children ?? []) {
        const liChildren: Content[] = (li.children ?? []) as Content[]
        let t = ''
        let body: Content[] = []
        if (liChildren.length > 0) {
          if (liChildren[0].type === 'paragraph') {
            t = flatten(liChildren[0] as Paragraph).trim()
            body = liChildren.slice(1)
          } else {
            t = flattenAny(liChildren[0]).trim()
            body = liChildren.slice(1)
          }
        }
        const node = {
          type: 'mdxJsxFlowElement' as any,
          name: 'Step',
          attributes: [],
          children: [
            ...(t ? ([{ type: 'heading', depth: 3, children: [{ type: 'text', value: t }] }] as any) : []),
            ...body,
          ] as any,
        } as any
        steps.push(node)
        lastStep = node
      }
      continue
    }

    if ((n as any).type === 'paragraph') {
      const m = /^\s*\d+[\.)]\s+(.+)$/u.exec(flatten(n as Paragraph))
      if (m) {
        // start a new numbered step
        flush()
        curTitle = m[1].trim()
        continue
      }
    }

    // otherwise, append to current step if exists, else to last produced step
    if (curTitle) curBody.push(n)
    else if (lastStep) (lastStep.children as any[]).push(n as any)
    // if no step exists yet, ignore stray nodes
  }
  flush()
  return steps
}

function flatten(p: Paragraph): string {
  let s = ''
  for (const c of p.children as any[]) {
    if (typeof (c as any).value === 'string') s += (c as any).value
  }
  return s
}

function flattenAny(n: any): string {
  if (!n) return ''
  if (typeof n.value === 'string') return n.value
  if (Array.isArray(n.children)) return n.children.map((c: any) => flattenAny(c)).join('')
  return ''
}

// detect admonition open token like ':::warning', ':::note Title', ':::type[Title]'
function isAdmonitionOpen(text: string): boolean {
  const s = text.trim()
  if (!s.startsWith(':::')) return false
  if (s === ':::') return false
  if (/^:::step\b/i.test(s)) return false
  return true
}
