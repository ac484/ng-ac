export class ContactPhone {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Contact phone cannot be empty');
    }

    // Basic phone number validation (Taiwan format)
    const phoneRegex = /^(\+886|886)?[0-9]{8,10}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      throw new Error('Invalid phone number format');
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): ContactPhone {
    return new ContactPhone(value);
  }
}
