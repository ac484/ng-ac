/**
 * Client representative value object
 */
export class ClientRepresentative {
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
      throw new Error('Client representative cannot be empty');
    }
    if (value.trim().length > 50) {
      throw new Error('Client representative cannot exceed 50 characters');
    }
  }
}
