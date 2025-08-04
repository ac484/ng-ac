/**
 * Repository error class for handling data access errors
 */
export class RepositoryError extends Error {
    readonly code = 'REPOSITORY_ERROR';
    readonly statusCode = 500;

    constructor(
        message: string,
        public override readonly cause?: Error
    ) {
        super(message);
        this.name = 'RepositoryError';
    }
}