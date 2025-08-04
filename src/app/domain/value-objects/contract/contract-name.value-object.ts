/**
 * Contract name value object
 */
export class ContractName {
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
      throw new Error('Contract name cannot be empty');
    }
    if (value.trim().length > 200) {
      throw new Error('Contract name cannot exceed 200 characters');
    }
  }
} 