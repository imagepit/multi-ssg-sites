import { visit } from 'unist-util-visit'
export function remarkAdmonitionBlocks() { return (tree: any) => { visit(tree, 'paragraph', () => {}) } }
