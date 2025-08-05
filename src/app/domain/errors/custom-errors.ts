export abstract class BaseError {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly name: string;
  readonly message: string;
  readonly cause?: Error;

  constructor(
    message: string,
    cause?: Error
  ) {
    this.message = message;
    this.cause = cause;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

export class ApplicationError extends BaseError {
  readonly code = 'APPLICATION_ERROR';
  readonly statusCode = 500;
}

export class RepositoryError extends BaseError {
  readonly code = 'REPOSITORY_ERROR';
  readonly statusCode = 500;
} 