import { DomainEvent } from './domain-event';
import { BaseEntity } from './base-entity';
import { ValueObject } from './value-object';

export abstract class BaseAggregateRoot<T extends ValueObject<any>> extends BaseEntity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
