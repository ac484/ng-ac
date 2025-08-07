import { ValueObject } from '@shared';
import { v4 as uuidv4 } from 'uuid';

/**
 * 用戶 ID 值物件
 */
export class UserId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }

  get value(): string {
    return this.props.value;
  }
}
