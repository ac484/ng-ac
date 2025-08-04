/**
 * Contact person value object
 */
export class ContactPerson {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Contact person cannot be empty');
    }
    if (value.trim().length > 50) {
      throw new Error('Contact person cannot exceed 50 characters');
    }
  }
}
