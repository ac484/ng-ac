import { DomainEvent } from '../../../../../shared/domain/domain-event';
import { UserId } from '../value-objects/user-id.vo';
import { UserProfile } from '../value-objects/user-profile.vo';

export class UserUpdatedEvent implements DomainEvent {
  readonly occurredOn: Date;
  readonly eventType: string;

  constructor(
    public readonly userId: UserId,
    public readonly profile: UserProfile
  ) {
    this.occurredOn = new Date();
    this.eventType = 'UserUpdated';
  }
} 