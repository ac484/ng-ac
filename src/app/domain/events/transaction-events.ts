import { DomainEvent } from './domain-event';

/**
 * Transaction created domain event
 */
export class TransactionCreatedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly type: string
  ) {
    super();
  }
}

/**
 * Transaction processed domain event
 */
export class TransactionProcessedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly newBalance: number
  ) {
    super();
  }
}

/**
 * Transaction failed domain event
 */
export class TransactionFailedEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly reason: string
  ) {
    super();
  }
}

/**
 * Transaction cancelled domain event
 */
export class TransactionCancelledEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly accountId: string,
    public readonly reason: string
  ) {
    super();
  }
}
