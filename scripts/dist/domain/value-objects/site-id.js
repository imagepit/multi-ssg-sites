import { DomainError } from '../errors.js';
const SITE_ID_PATTERN = /^[a-z0-9-]+$/;
export class SiteId {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(raw) {
        const trimmed = raw.trim();
        if (!trimmed) {
            throw new DomainError('siteId is required');
        }
        if (!SITE_ID_PATTERN.test(trimmed)) {
            throw new DomainError(`siteId must match ${SITE_ID_PATTERN}`);
        }
        return new SiteId(trimmed);
    }
    toString() {
        return this.value;
    }
}
