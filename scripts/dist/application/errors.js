export class UseCaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UseCaseError';
    }
}
