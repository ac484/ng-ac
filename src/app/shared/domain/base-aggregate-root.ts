import { DomainEvent } from './domain-event';

export abstract class BaseAggregateRoot<TId> extends BaseEntity<TId> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(
    id: TId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected markAsModified(): void {
    // This method can be overridden to handle modification tracking
  }
} 