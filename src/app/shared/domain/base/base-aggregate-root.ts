import { DomainEvent } from './domain-event';

export abstract class BaseAggregateRoot<TId> {
  private _domainEvents: DomainEvent[] = [];
  protected readonly id: TId;

  constructor(id: TId) {
    this.id = id;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  public get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }
}
