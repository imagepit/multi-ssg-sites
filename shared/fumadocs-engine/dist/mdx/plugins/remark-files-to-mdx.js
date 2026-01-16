import { visit } from 'unist-util-visit';
// Remark plugin: transform ```files fenced blocks into
// <Files><Folder name="src"><File name="index.tsx"/></Folder>...</Files>
export function remarkFilesToMdx() {
    return (tree) => {
        visit(tree, 'code', (node, index, parent) => {
            if (!parent || typeof index !== 'number')
                return;
            const lang = (node.lang || '').toLowerCase();
            if (lang !== 'files')
                return;
            const value = String(node.value || '');
            const children = buildFilesAst(value);
            const filesNode = jsxEl('Files', [], children);
            parent.children[index] = filesNode;
        });
    };
}
function jsxEl(name, attrs = [], children = []) {
    return {
        type: 'mdxJsxFlowElement',
        name,
        attributes: attrs.map((a) => ({ type: 'mdxJsxAttribute', name: a.name, value: a.value })),
        children,
        data: { _mdxExplicitJsx: true },
    };
}
function buildFilesAst(text) {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/[\u2500-\u257F│├└┘┌┐┬┴├┤┼─┄┈┃╎]+/g, ' '))
        .map((l) => l.replace(/^\s*[-*]\s+/, '')) // bullets -> plain
        .filter((l) => l.trim().length > 0);
    // compute indent as count of leading spaces / 2 (rounded down), tabs count as 1
    const entries = lines.map((raw) => {
        const m = /^(\s*)(.*)$/.exec(raw);
        const lead = m[1] || '';
        const rest = (m[2] || '').trim();
        const leadSpaces = lead.replace(/\t/g, '  ').length;
        const indent = Math.floor(leadSpaces / 2);
        return { indent, label: rest };
    });
    const root = { children: [] };
    const stack = [root];
    for (let i = 0; i < entries.length; i++) {
        const { indent, label } = entries[i];
        const nextIndent = i + 1 < entries.length ? entries[i + 1].indent : indent;
        while (stack.length - 1 > indent)
            stack.pop();
        const isFolder = /\/$/.test(label) || nextIndent > indent;
        const name = label.replace(/\/$/, '');
        if (isFolder) {
            const folder = jsxEl('Folder', [{ name: 'name', value: name }], []);
            last(stack).children.push(folder);
            stack.push(folder);
        }
        else {
            const file = jsxEl('File', [{ name: 'name', value: name }], []);
            last(stack).children.push(file);
        }
    }
    return root.children;
}
function last(arr) { return arr[arr.length - 1]; }
