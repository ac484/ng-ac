import { ValueObject } from '../../../../shared/domain/value-object';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL?: string;
}

export class UserProfile extends ValueObject<UserProfileProps> {
  private constructor(props: UserProfileProps) {
    super(props);
  }

  public static create(firstName: string, lastName: string, displayName: string, photoURL?: string): UserProfile {
    return new UserProfile({ firstName, lastName, displayName, photoURL });
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }
  
  get displayName(): string {
    return this.props.displayName;
  }

  get photoURL(): string | undefined {
    return this.props.photoURL;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }
}
