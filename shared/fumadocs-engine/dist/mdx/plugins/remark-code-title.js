import { visit } from 'unist-util-visit';
// Convert a preceding emphasized paragraph like _path/to/file.ext_
// into a code block title: ```lang title="path/to/file.ext"
// The emphasis paragraph will be removed.
export function remarkCodeTitleBeforeBlocks() {
    return (tree) => {
        visit(tree, 'paragraph', (node, index, parent) => {
            if (!parent || typeof index !== 'number')
                return;
            const title = extractEmphasisTitle(node);
            if (!title)
                return;
            const next = parent.children[index + 1];
            if (!next || next.type !== 'code')
                return;
            // Append to meta string as title="..."
            const encoded = title.replace(/"/g, '&quot;');
            const metaPart = `title="${encoded}"`;
            if (typeof next.meta === 'string' && next.meta.trim().length > 0) {
                next.meta = `${next.meta} ${metaPart}`;
            }
            else {
                ;
                next.meta = metaPart;
            }
            // Remove the paragraph node (title source)
            parent.children.splice(index, 1);
            // Continue after the code node (now shifted one position up)
            return index;
        });
    };
}
function extractEmphasisTitle(p) {
    if (!p.children || p.children.length !== 1)
        return null;
    const child = p.children[0];
    if (child.type !== 'emphasis' && child.type !== 'strong')
        return null;
    const text = flattenPhrasing(child);
    const trimmed = text.trim();
    if (!trimmed)
        return null;
    return trimmed;
}
function flattenPhrasing(n) {
    if (!n)
        return '';
    if (typeof n.value === 'string')
        return n.value;
    if (Array.isArray(n.children))
        return n.children.map((c) => flattenPhrasing(c)).join('');
    return '';
}
