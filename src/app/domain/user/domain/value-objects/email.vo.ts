import { ValueObject } from '../../../../shared/domain/value-object';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

export class Email extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new InvalidEmailException(value);
    }
    return new Email({ value });
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this.props.value;
  }
}
