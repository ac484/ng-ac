import { DomainEvent } from '../../../../shared/domain/domain-event';
import { UserId } from '../../../user/domain/value-objects/user-id.vo';

export class UserLoggedInEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly aggregateId: UserId) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): any {
    return this.aggregateId;
  }
}
