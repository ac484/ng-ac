import { DomainEvent } from './domain-event';

/**
 * User authenticated domain event
 */
export class UserAuthenticatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly provider: string,
    public readonly email: string
  ) {
    super();
  }
}

/**
 * User signed out domain event
 */
export class UserSignedOutEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly sessionId: string
  ) {
    super();
  }
}

/**
 * Authentication failed domain event
 */
export class AuthenticationFailedEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly provider: string,
    public readonly reason: string
  ) {
    super();
  }
}

/**
 * Token refreshed domain event
 */
export class TokenRefreshedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly newToken: string,
    public readonly expiresAt: Date
  ) {
    super();
  }
} 