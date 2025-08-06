import { Injectable } from '@angular/core';
import { DomainEvent } from '../domain/domain-event';

@Injectable({
  providedIn: 'root'
})
export abstract class EventBus {
  abstract publish(event: DomainEvent): Promise<void>;
  abstract publishAll(events: DomainEvent[]): Promise<void>;
}
