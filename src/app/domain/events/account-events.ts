import { DomainEvent } from './domain-event';

/**
 * Account created domain event
 */
export class AccountCreatedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly initialBalance: number
  ) {
    super();
  }
}

/**
 * Account updated domain event
 */
export class AccountUpdatedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly balance: number
  ) {
    super();
  }
}

/**
 * Account balance changed domain event
 */
export class AccountBalanceChangedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly oldBalance: number,
    public readonly newBalance: number,
    public readonly changeAmount: number
  ) {
    super();
  }
}

/**
 * Account closed domain event
 */
export class AccountClosedEvent extends DomainEvent {
  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly finalBalance: number
  ) {
    super();
  }
} 