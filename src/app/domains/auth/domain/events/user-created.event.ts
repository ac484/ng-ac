import { DomainEvent } from '@shared';

import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserProfile } from '../value-objects/user-profile.vo';

/**
 * 用戶創建事件
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly profile: UserProfile
  ) {
    super();
  }

  getEventName(): string {
    return 'UserCreatedEvent';
  }
}
