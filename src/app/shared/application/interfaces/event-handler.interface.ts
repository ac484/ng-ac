import { DomainEvent } from '../../domain/domain-event';

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): void;
}
