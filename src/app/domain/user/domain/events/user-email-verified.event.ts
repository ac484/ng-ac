import { DomainEvent } from '../../../../../shared/domain/domain-event';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export class UserEmailVerifiedEvent implements DomainEvent {
  readonly occurredOn: Date;
  readonly eventType: string;

  constructor(
    public readonly userId: UserId,
    public readonly email: Email
  ) {
    this.occurredOn = new Date();
    this.eventType = 'UserEmailVerified';
  }
} 