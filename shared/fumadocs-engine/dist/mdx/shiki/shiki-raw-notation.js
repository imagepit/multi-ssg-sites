// General raw notation transformer for languages without line comments.
// Supports: ++, --, highlight(hl), focus, error, warning
export function transformerRawNotationDiff() {
    const KEY = {
        add: '__raw_add_lines',
        del: '__raw_remove_lines',
        highlight: '__raw_highlight_lines',
        focus: '__raw_focus_lines',
        error: '__raw_error_lines',
        warning: '__raw_warning_lines',
    };
    const TOKENS = ['++', '--', 'highlight', 'hl', 'focus', 'error', 'warning'];
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const TOKEN_RE = new RegExp(`\\s*(?:<!--\\s*)?(?:\/\/|#|;|--|%|REM\\b)?\\s*\\[!code\\s+(${TOKENS.map(escapeRegExp).join('|')})(?::(\\d+))?\\]\\s*(?:-->)?\\s*$`, 'i');
    const mapToken = (t) => {
        const k = t.toLowerCase();
        if (k === '++')
            return 'add';
        if (k === '--')
            return 'del';
        if (k === 'highlight' || k === 'hl')
            return 'highlight';
        if (k === 'focus')
            return 'focus';
        if (k === 'error')
            return 'error';
        if (k === 'warning')
            return 'warning';
        return null;
    };
    return {
        name: 'raw-notation-map',
        preprocess(code) {
            const lines = code.split(/\r?\n/);
            const bag = {};
            for (let i = 0; i < lines.length; i++) {
                const m = lines[i].match(TOKEN_RE);
                if (!m)
                    continue;
                const mode = mapToken(m[1]);
                if (!mode)
                    continue;
                const span = Math.max(1, m[2] ? parseInt(m[2], 10) : 1);
                for (let j = 0; j < span && i + j < lines.length; j++) {
                    const lineNo = i + 1 + j;
                    (bag[mode] ||= []).push(lineNo);
                }
                lines[i] = lines[i].replace(TOKEN_RE, '');
            }
            const meta = this.meta || (this.meta = {});
            for (const k of Object.keys(bag))
                meta[KEY[k]] = Array.from(new Set(bag[k]));
            return lines.join('\n');
        },
        pre(hast) {
            const meta = this.meta || {};
            const hasDiff = (meta[KEY.add]?.length ?? 0) > 0 || (meta[KEY.del]?.length ?? 0) > 0;
            const hasHl = (meta[KEY.highlight]?.length ?? 0) > 0 || (meta[KEY.error]?.length ?? 0) > 0 || (meta[KEY.warning]?.length ?? 0) > 0;
            const hasFocus = (meta[KEY.focus]?.length ?? 0) > 0;
            if (hasDiff)
                this.addClassToHast(hast, 'has-diff');
            if (hasHl)
                this.addClassToHast(hast, 'has-highlighted');
            if (hasFocus)
                this.addClassToHast(hast, 'has-focused');
            return hast;
        },
        line(hast, lineNo) {
            const meta = this.meta || {};
            const add = meta[KEY.add] || [];
            const del = meta[KEY.del] || [];
            const hl = meta[KEY.highlight] || [];
            const focus = meta[KEY.focus] || [];
            const err = meta[KEY.error] || [];
            const warn = meta[KEY.warning] || [];
            if (add.includes(lineNo))
                this.addClassToHast(hast, ['diff', 'add']);
            if (del.includes(lineNo))
                this.addClassToHast(hast, ['diff', 'remove']);
            if (hl.includes(lineNo))
                this.addClassToHast(hast, 'highlighted');
            if (focus.includes(lineNo))
                this.addClassToHast(hast, 'focused');
            if (err.includes(lineNo))
                this.addClassToHast(hast, ['highlighted', 'error']);
            if (warn.includes(lineNo))
                this.addClassToHast(hast, ['highlighted', 'warning']);
            return hast;
        },
    };
}
