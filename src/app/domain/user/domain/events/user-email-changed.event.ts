import { DomainEvent } from '../../../../shared/domain/domain-event';

export class UserEmailChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly aggregateId: string, public readonly newEmail: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): any {
    return this.aggregateId;
  }
}
