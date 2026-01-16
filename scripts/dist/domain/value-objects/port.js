import { DomainError } from '../errors.js';
export class Port {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(raw) {
        const num = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
        if (!Number.isFinite(num)) {
            throw new DomainError('port must be a number');
        }
        if (num < 1 || num > 65535) {
            throw new DomainError('port must be between 1 and 65535');
        }
        return new Port(num);
    }
    toNumber() {
        return this.value;
    }
    toString() {
        return String(this.value);
    }
}
