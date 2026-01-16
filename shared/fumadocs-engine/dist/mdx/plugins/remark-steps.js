import { visit } from 'unist-util-visit';
// Transform custom :::step ... ::: blocks into
// <Steps><Step><h3>title</h3> ...</Step>...</Steps>
export function remarkStepBlocks() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (!parent || typeof index !== 'number')
                return;
            if (node.type !== 'paragraph')
                return;
            const text = flatten(node);
            if (text.trim() !== ':::step')
                return;
            // find closing ::: (support nested admonitions inside step)
            let end = -1;
            let depth = 0;
            for (let i = index + 1; i < parent.children.length; i++) {
                const n = parent.children[i];
                if (n.type === 'paragraph') {
                    const t = flatten(n).trim();
                    if (isAdmonitionOpen(t)) {
                        depth++;
                        continue;
                    }
                    if (t === ':::') {
                        if (depth > 0) {
                            depth--;
                            continue;
                        }
                        end = i;
                        break;
                    }
                }
            }
            if (end === -1)
                return;
            const region = parent.children.slice(index + 1, end);
            const steps = buildSteps(region);
            if (steps.length === 0)
                return;
            const stepsElement = {
                type: 'mdxJsxFlowElement',
                name: 'Steps',
                attributes: [],
                children: steps,
            };
            // replace only when we have at least 1 step
            parent.children.splice(index, end - index + 1, stepsElement);
            // tell visitor to continue after inserted node
            return index;
        });
    };
}
function buildSteps(nodes) {
    const steps = [];
    let curTitle = null;
    let curBody = [];
    let lastStep = null;
    const flush = () => {
        if (!curTitle && curBody.length === 0)
            return;
        const children = [];
        if (curTitle) {
            children.push({ type: 'heading', depth: 3, children: [{ type: 'text', value: curTitle }] });
        }
        children.push(...curBody);
        const node = {
            type: 'mdxJsxFlowElement',
            name: 'Step',
            attributes: [],
            children,
        };
        steps.push(node);
        lastStep = node;
        curTitle = null;
        curBody = [];
    };
    for (const n of nodes) {
        if (n.type === 'list' && n.ordered) {
            // finalize current step before expanding the list
            flush();
            const list = n;
            for (const li of list.children ?? []) {
                const liChildren = (li.children ?? []);
                let t = '';
                let body = [];
                if (liChildren.length > 0) {
                    if (liChildren[0].type === 'paragraph') {
                        t = flatten(liChildren[0]).trim();
                        body = liChildren.slice(1);
                    }
                    else {
                        t = flattenAny(liChildren[0]).trim();
                        body = liChildren.slice(1);
                    }
                }
                const node = {
                    type: 'mdxJsxFlowElement',
                    name: 'Step',
                    attributes: [],
                    children: [
                        ...(t ? [{ type: 'heading', depth: 3, children: [{ type: 'text', value: t }] }] : []),
                        ...body,
                    ],
                };
                steps.push(node);
                lastStep = node;
            }
            continue;
        }
        if (n.type === 'paragraph') {
            const m = /^\s*\d+[\.)]\s+(.+)$/u.exec(flatten(n));
            if (m) {
                // start a new numbered step
                flush();
                curTitle = m[1].trim();
                continue;
            }
        }
        // otherwise, append to current step if exists, else to last produced step
        if (curTitle)
            curBody.push(n);
        else if (lastStep)
            lastStep.children.push(n);
        // if no step exists yet, ignore stray nodes
    }
    flush();
    return steps;
}
function flatten(p) {
    let s = '';
    for (const c of p.children) {
        if (typeof c.value === 'string')
            s += c.value;
    }
    return s;
}
function flattenAny(n) {
    if (!n)
        return '';
    if (typeof n.value === 'string')
        return n.value;
    if (Array.isArray(n.children))
        return n.children.map((c) => flattenAny(c)).join('');
    return '';
}
// detect admonition open token like ':::warning', ':::note Title', ':::type[Title]'
function isAdmonitionOpen(text) {
    const s = text.trim();
    if (!s.startsWith(':::'))
        return false;
    if (s === ':::')
        return false;
    if (/^:::step\b/i.test(s))
        return false;
    return true;
}
