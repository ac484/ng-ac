import { DomainEvent } from '../../../../shared/domain/domain-event';

export class UserCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly aggregateId: string, public readonly email: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): any {
    return this.aggregateId;
  }
}
