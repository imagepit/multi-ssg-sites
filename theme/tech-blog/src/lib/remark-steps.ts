import { visit } from 'unist-util-visit'
export function remarkStepBlocks() { return (tree: any) => { visit(tree, 'paragraph', () => {}) } }
