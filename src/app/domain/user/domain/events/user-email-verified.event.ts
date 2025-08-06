import { DomainEvent } from '../../../../shared/domain/domain-event';

export class UserEmailVerifiedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly aggregateId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): any {
    return this.aggregateId;
  }
}
