import { DomainEvent } from '../domain/domain-event';

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void;
  unsubscribe(eventType: string, handler: EventHandler<DomainEvent>): void;
}

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler<DomainEvent>[]> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    
    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventType}:`, error);
      }
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as EventHandler<DomainEvent>);
  }

  unsubscribe(eventType: string, handler: EventHandler<DomainEvent>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
} 