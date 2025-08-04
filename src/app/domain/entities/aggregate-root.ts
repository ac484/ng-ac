import { BaseEntity } from './base-entity';
import { DomainEvent } from '../events/domain-event';

/**
 * Aggregate root base class
 * All aggregate roots should extend this class
 */
export abstract class AggregateRoot<TId> extends BaseEntity<TId> {
  private _domainEvents: DomainEvent[] = [];

  /**
   * Add a domain event to the aggregate
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Get all domain events
   */
  getDomainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  /**
   * Clear all domain events
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Check if the aggregate has domain events
   */
  hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * Get the number of domain events
   */
  getDomainEventCount(): number {
    return this._domainEvents.length;
  }
} 