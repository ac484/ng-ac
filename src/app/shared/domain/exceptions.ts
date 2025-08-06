export abstract class DomainException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class ApplicationException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends ApplicationException {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends ApplicationException {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
  }
}

export class RepositoryError extends ApplicationException {
  constructor(message: string) {
    super(message, 'REPOSITORY_ERROR');
  }
}

export class InternalServerErrorException extends ApplicationException {
  constructor(message: string) {
    super(message, 'INTERNAL_SERVER_ERROR');
  }
}

export class NetworkErrorException extends ApplicationException {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
  }
}
