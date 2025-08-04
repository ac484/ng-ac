import { DomainEvent } from './domain-event';

/**
 * User created domain event
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly displayName: string
  ) {
    super();
  }
}

/**
 * User updated domain event
 */
export class UserUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly displayName: string,
    public readonly photoURL?: string
  ) {
    super();
  }
}

/**
 * User status changed domain event
 */
export class UserStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string
  ) {
    super();
  }
}

/**
 * User deactivated domain event
 */
export class UserDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly reason?: string
  ) {
    super();
  }
}

/**
 * User activated domain event
 */
export class UserActivatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string
  ) {
    super();
  }
} 