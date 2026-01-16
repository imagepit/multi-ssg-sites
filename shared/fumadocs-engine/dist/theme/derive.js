function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}
function parseHsl(input) {
    const str = input.trim().toLowerCase();
    const m1 = str.match(/^hsl\(([-+]?\d+(?:\.\d+)?)(?:deg)?[\s,]+(\d+(?:\.\d+)?)%[\s,]+(\d+(?:\.\d+)?)%\)$/);
    if (!m1)
        return null;
    const h = ((parseFloat(m1[1]) % 360) + 360) % 360;
    const s = clamp(parseFloat(m1[2]), 0, 100);
    const l = clamp(parseFloat(m1[3]), 0, 100);
    return { h, s, l };
}
function parseHex(input) {
    const str = input.trim().toLowerCase();
    if (!str.startsWith('#'))
        return null;
    const hex = str.slice(1);
    if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b };
    }
    if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b };
    }
    return null;
}
function parseRgb(input) {
    const str = input.trim().toLowerCase();
    const m = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/);
    if (!m)
        return null;
    const r = clamp(parseInt(m[1], 10), 0, 255);
    const g = clamp(parseInt(m[2], 10), 0, 255);
    const b = clamp(parseInt(m[3], 10), 0, 255);
    return { r, g, b };
}
function rgbToHsl({ r, g, b }) {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rr:
                h = (gg - bb) / d + (gg < bb ? 6 : 0);
                break;
            case gg:
                h = (bb - rr) / d + 2;
                break;
            default:
                h = (rr - gg) / d + 4;
        }
        h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
}
function parseAnyToHsl(input) {
    return (parseHsl(input) ||
        (() => {
            const rgb = parseHex(input);
            return rgb ? rgbToHsl(rgb) : null;
        })() ||
        (() => {
            const rgb = parseRgb(input);
            return rgb ? rgbToHsl(rgb) : null;
        })());
}
function toHsl({ h, s, l }) {
    const hh = ((h % 360) + 360) % 360;
    return `hsl(${hh}deg ${clamp(s, 0, 100)}% ${clamp(l, 0, 100)}%)`;
}
function adjust(hsl, ds = 0, dl = 0) {
    return { h: hsl.h, s: clamp(hsl.s + ds, 0, 100), l: clamp(hsl.l + dl, 0, 100) };
}
function chooseForeground(lightness) {
    return lightness < 55 ? 'hsl(0 0% 98%)' : 'hsl(0 0% 9%)';
}
export function deriveThemeFromPrimary(primaryRaw) {
    const defaultPrimary = 'hsl(260deg 90% 55%)';
    const base = parseAnyToHsl(primaryRaw ?? '') ?? parseHsl(defaultPrimary);
    const primary = toHsl(base);
    const primaryFg = chooseForeground(base.l);
    const secondary = toHsl({ h: base.h, s: Math.max(12, base.s * 0.2), l: 93 });
    const secondaryFg = 'hsl(0 0% 9%)';
    const accent = toHsl(adjust(base, -(base.s * 0.5), Math.max(20, 85 - base.l)));
    const accentFg = 'hsl(0 0% 9%)';
    const ring = toHsl(adjust(base, 0, Math.max(-10, 40 - base.l)));
    const darkBase = { h: base.h, s: clamp(base.s * 0.7, 20, 90), l: clamp(92 - (100 - base.l) * 0.3, 60, 96) };
    const dPrimary = toHsl(darkBase);
    const dPrimaryFg = chooseForeground(darkBase.l);
    const dSecondary = toHsl({ h: base.h, s: Math.max(16, base.s * 0.25), l: 13 });
    const dSecondaryFg = 'hsl(0 0% 92%)';
    const dAccent = toHsl({ h: base.h, s: clamp(base.s * 0.35, 10, 60), l: 18 });
    const dAccentFg = 'hsl(0 0% 90%)';
    const dRing = toHsl({ h: base.h, s: clamp(base.s * 0.5, 20, 80), l: 55 });
    return {
        light: {
            '--color-fd-primary': primary,
            '--color-fd-primary-foreground': primaryFg,
            '--color-fd-secondary': secondary,
            '--color-fd-secondary-foreground': secondaryFg,
            '--color-fd-accent': accent,
            '--color-fd-accent-foreground': accentFg,
            '--color-fd-ring': ring,
        },
        dark: {
            '--color-fd-primary': dPrimary,
            '--color-fd-primary-foreground': dPrimaryFg,
            '--color-fd-secondary': dSecondary,
            '--color-fd-secondary-foreground': dSecondaryFg,
            '--color-fd-accent': dAccent,
            '--color-fd-accent-foreground': dAccentFg,
            '--color-fd-ring': dRing,
        },
    };
}
export function buildThemeCssFromPrimary(primary) {
    const derived = deriveThemeFromPrimary(primary);
    const light = Object.entries(derived.light)
        .map(([k, v]) => `${k}: ${v};`)
        .join('\n  ');
    const dark = Object.entries(derived.dark)
        .map(([k, v]) => `${k}: ${v};`)
        .join('\n  ');
    return `:root {\n  ${light}\n}\n.dark {\n  ${dark}\n}`;
}
