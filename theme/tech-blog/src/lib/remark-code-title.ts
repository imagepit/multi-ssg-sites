import { visit } from 'unist-util-visit'
export function remarkCodeTitleBeforeBlocks() { return (tree: any) => { visit(tree, 'code', () => {}) } }
