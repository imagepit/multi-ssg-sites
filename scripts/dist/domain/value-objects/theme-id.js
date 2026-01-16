import { DomainError } from '../errors.js';
const THEME_ID_PATTERN = /^[a-z0-9-]+$/;
export class ThemeId {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(raw) {
        const trimmed = raw.trim();
        if (!trimmed) {
            throw new DomainError('themeId is required');
        }
        if (!THEME_ID_PATTERN.test(trimmed)) {
            throw new DomainError(`themeId must match ${THEME_ID_PATTERN}`);
        }
        return new ThemeId(trimmed);
    }
    toString() {
        return this.value;
    }
}
