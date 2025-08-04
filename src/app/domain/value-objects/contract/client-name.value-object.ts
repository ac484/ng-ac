/**
 * Client name value object
 */
export class ClientName {
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
      throw new Error('Client name cannot be empty');
    }
    if (value.trim().length > 100) {
      throw new Error('Client name cannot exceed 100 characters');
    }
  }
} 