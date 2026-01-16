import { visit } from 'unist-util-visit';
const typeMap = {
    note: 'info',
    info: 'info',
    notice: 'info',
    syntax: 'info',
    tip: 'success',
    success: 'success',
    failure: 'error',
    danger: 'error',
    error: 'error',
    warning: 'warning',
    caution: 'warning',
    important: 'warning',
    'speech-left': 'speech-left',
    'speech-right': 'speech-right',
    point1: 'info',
    point2: 'info',
    point3: 'info',
    point4: 'info',
    point5: 'info',
    point6: 'info',
    point7: 'info',
    point8: 'info',
    point9: 'info',
    point10: 'info',
};
export function remarkAdmonitionBlocks() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (!parent || typeof index !== 'number')
                return;
            if (node.type !== 'paragraph')
                return;
            const text = flatten(node);
            const open = parseOpen(text);
            if (!open)
                return;
            // find the matching closing :::
            let end = -1;
            for (let i = index + 1; i < parent.children.length; i++) {
                const n = parent.children[i];
                if (n.type === 'paragraph' && flatten(n).trim() === ':::') {
                    end = i;
                    break;
                }
            }
            if (end === -1)
                return;
            const inner = parent.children.slice(index + 1, end);
            const el = {
                type: 'mdxJsxFlowElement',
                name: 'Callout',
                attributes: [
                    { type: 'mdxJsxAttribute', name: 'type', value: mapType(open.type) },
                    ...(open.title ? [{ type: 'mdxJsxAttribute', name: 'title', value: open.title }] : []),
                ],
                children: inner,
            };
            parent.children.splice(index, end - index + 1, el);
            return index;
        });
    };
}
function parseOpen(text) {
    const s = text.trim();
    if (!s.startsWith(':::'))
        return null;
    const rest = s.slice(3).trim();
    if (!rest)
        return null;
    // :::type[Title]
    const m1 = /^([A-Za-z0-9_-]+)\[(.*)\]$/.exec(rest);
    if (m1)
        return { type: m1[1], title: m1[2] };
    // :::type Title
    const m2 = /^([A-Za-z0-9_-]+)\s+(.+)$/.exec(rest);
    if (m2)
        return { type: m2[1], title: m2[2] };
    // :::type
    const m3 = /^([A-Za-z0-9_-]+)$/.exec(rest);
    if (m3)
        return { type: m3[1] };
    return null;
}
function mapType(input) {
    return typeMap[input] ?? 'info';
}
function flatten(p) {
    let s = '';
    for (const c of p.children) {
        if (typeof c.value === 'string')
            s += c.value;
    }
    return s;
}
