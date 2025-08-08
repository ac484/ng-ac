import { ValueObject } from '@shared';

/**
 * 郵箱值物件
 */
export class Email extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): Email {
    if (!Email.isValidEmail(value)) {
      throw new Error(`Invalid email format: ${value}`);
    }
    return new Email(value.toLowerCase().trim());
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this.props.value;
  }

  get domain(): string {
    return this.props.value.split('@')[1];
  }

  isValid(): boolean {
    return Email.isValidEmail(this.props.value);
  }
}
