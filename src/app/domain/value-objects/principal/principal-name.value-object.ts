export class PrincipalName {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Principal 名稱不能為空');
    }
    if (value.trim().length > 100) {
      throw new Error('Principal 名稱不能超過 100 個字符');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PrincipalName): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): PrincipalName {
    return new PrincipalName(value);
  }
}
