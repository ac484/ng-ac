import { BaseAggregateRoot } from '../../../../shared/domain/base-aggregate-root';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { UserProfile } from '../value-objects/user-profile.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { UserEmailVerifiedEvent } from '../events/user-email-verified.event';

export class User extends BaseAggregateRoot<UserId> {
  private constructor(
    id: UserId,
    private _email: Email,
    private _profile: UserProfile,
    private _isEmailVerified: boolean = false,
    private _isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(email: Email, profile: UserProfile): User {
    const user = new User(UserId.generate(), email, profile);
    user.addDomainEvent(new UserCreatedEvent(user.id, email));
    return user;
  }

  static reconstitute(
    id: UserId,
    email: Email,
    profile: UserProfile,
    isEmailVerified: boolean = false,
    isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ): User {
    return new User(id, email, profile, isEmailVerified, isActive, createdAt, updatedAt);
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

  get isActive(): boolean {
    return this._isActive;
  }

  updateProfile(profile: UserProfile): void {
    if (!this._profile.equals(profile)) {
      this._profile = profile;
      this.markAsModified();
      this.addDomainEvent(new UserUpdatedEvent(this.id, this._profile));
    }
  }

  changeEmail(newEmail: Email): void {
    if (!this._email.equals(newEmail)) {
      this._email = newEmail;
      this._isEmailVerified = false;
      this.markAsModified();
      this.addDomainEvent(new UserUpdatedEvent(this.id, this._profile));
    }
  }

  verifyEmail(): void {
    if (!this._isEmailVerified) {
      this._isEmailVerified = true;
      this.markAsModified();
      this.addDomainEvent(new UserEmailVerifiedEvent(this.id, this._email));
    }
  }

  deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this.markAsModified();
      this.addDomainEvent(new UserUpdatedEvent(this.id, this._profile));
    }
  }

  activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this.markAsModified();
      this.addDomainEvent(new UserUpdatedEvent(this.id, this._profile));
    }
  }
} 