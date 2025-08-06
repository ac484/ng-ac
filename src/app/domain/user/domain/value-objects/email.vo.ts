import { ValueObject } from '../../../../shared/domain/value-object';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new InvalidEmailException(value);
    }
    return new Email({ value: value.toLowerCase().trim() });
  }

  get value(): string {
    return this.props.value;
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected validate(props: EmailProps): void {
    if (!Email.isValid(props.value)) {
      throw new InvalidEmailException(props.value);
    }
  }
} 