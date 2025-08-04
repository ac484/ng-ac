export class PrincipalId {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Principal ID 不能為空');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PrincipalId): boolean {
    return this.value === other.value;
  }

  static generate(): PrincipalId {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return new PrincipalId(`principal_${timestamp}_${random}`);
  }

  static fromString(value: string): PrincipalId {
    return new PrincipalId(value);
  }
}
