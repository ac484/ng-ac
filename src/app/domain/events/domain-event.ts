/**
 * Base domain event class
 * All domain events should extend this class
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = this.generateEventId();
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the event name
   */
  getEventName(): string {
    return this.constructor.name;
  }

  /**
   * Get the event version
   */
  getEventVersion(): string {
    return '1.0';
  }
}

/**
 * Domain event handler interface
 */
export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): void | Promise<void>;
}

/**
 * Domain event bus interface
 */
export interface DomainEventBus {
  publish(event: DomainEvent): void;
  subscribe<T extends DomainEvent>(eventType: new () => T, handler: DomainEventHandler<T>): void;
  unsubscribe<T extends DomainEvent>(eventType: new () => T, handler: DomainEventHandler<T>): void;
}

/**
 * Simple in-memory domain event bus implementation
 */
export class InMemoryDomainEventBus implements DomainEventBus {
  private handlers = new Map<string, Array<DomainEventHandler<any>>>();

  publish(event: DomainEvent): void {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    handlers.forEach(handler => {
      try {
        handler.handle(event);
      } catch (error) {
        console.error(`Error handling domain event ${eventName}:`, error);
      }
    });
  }

  subscribe<T extends DomainEvent>(eventType: new () => T, handler: DomainEventHandler<T>): void {
    const eventName = eventType.name;
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  unsubscribe<T extends DomainEvent>(eventType: new () => T, handler: DomainEventHandler<T>): void {
    const eventName = eventType.name;
    const handlers = this.handlers.get(eventName) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.handlers.set(eventName, handlers);
    }
  }
}
