import { visit } from 'unist-util-visit'

export function remarkAddDelRegions() {
  return (tree: any) => {
    // no-op lightweight port; keep compatibility with pipeline
    visit(tree, 'code', () => {})
  }
}
