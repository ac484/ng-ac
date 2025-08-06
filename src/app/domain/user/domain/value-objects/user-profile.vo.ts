import { ValueObject } from '../../../../shared/domain/value-object';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
}

export class UserProfile extends ValueObject<UserProfileProps> {
  private constructor(props: UserProfileProps) {
    super(props);
  }

  static create(firstName: string, lastName: string, displayName?: string, avatar?: string): UserProfile {
    return new UserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName?.trim(),
      avatar
    });
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get displayName(): string {
    return this.props.displayName || `${this.firstName} ${this.lastName}`;
  }

  get avatar(): string | undefined {
    return this.props.avatar;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  protected validate(props: UserProfileProps): void {
    if (!props.firstName || props.firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!props.lastName || props.lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
  }
} 