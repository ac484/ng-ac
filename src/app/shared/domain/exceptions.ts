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

export abstract class InfrastructureException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
} 