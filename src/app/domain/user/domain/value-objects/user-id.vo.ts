import { ValueObject } from '../../../../shared/domain/value-object';

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    return new UserId({ value: value.trim() });
  }

  static generate(): UserId {
    return new UserId({ value: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate(props: UserIdProps): void {
    if (!props.value || props.value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }
} 