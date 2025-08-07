import { ValueObject } from '@shared';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
}

/**
 * 用戶資料值物件
 */
export class UserProfile extends ValueObject<UserProfileProps> {
  private constructor(props: UserProfileProps) {
    super({
      ...props,
      displayName: props.displayName || `${props.firstName} ${props.lastName}`
    });
  }

  static create(firstName: string, lastName: string, displayName?: string, avatar?: string): UserProfile {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }

    return new UserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName,
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
    return this.props.displayName!;
  }

  get avatar(): string | undefined {
    return this.props.avatar;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }
}
