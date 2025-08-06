import { BaseAggregateRoot } from '../../../../shared/domain/base-aggregate-root';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { UserProfile } from '../value-objects/user-profile.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserEmailChangedEvent } from '../events/user-email-changed.event';

export class User extends BaseAggregateRoot<UserId> {
  private _email: Email;
  private _profile: UserProfile;
  private _isEmailVerified: boolean;
  private _lastLoginAt?: Date;

  private constructor(
    id: UserId,
    email: Email,
    profile: UserProfile,
    isEmailVerified: boolean,
    lastLoginAt?: Date
  ) {
    super(id);
    this._email = email;
    this._profile = profile;
    this._isEmailVerified = isEmailVerified;
    this._lastLoginAt = lastLoginAt;
  }

  static create(email: Email, profile: UserProfile): User {
    const user = new User(UserId.create(), email, profile, false);
    user.addDomainEvent(new UserCreatedEvent(user.id.value, email.value));
    return user;
  }

  static reconstitute(id: UserId, email: Email, profile: UserProfile, isEmailVerified: boolean, lastLoginAt: Date, createdAt: Date): User {
    const user = new User(id, email, profile, isEmailVerified, lastLoginAt);
    return user;
  }

  get email(): Email {
    return this._email;
  }

  get profile(): UserProfile {
    return this._profile;
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  changeEmail(newEmail: Email): void {
    if (!this._email.equals(newEmail)) {
      this._email = newEmail;
      this.addDomainEvent(new UserEmailChangedEvent(this.id.value, newEmail.value));
    }
  }

  verifyEmail(): void {
    this._isEmailVerified = true;
  }

  updateLastLoginAt(): void {
    this._lastLoginAt = new Date();
  }
}
