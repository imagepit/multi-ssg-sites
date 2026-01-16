import { visit } from 'unist-util-visit'
export function rehypeBashClass() { return (tree: any) => { visit(tree, 'element', () => {}) } }
