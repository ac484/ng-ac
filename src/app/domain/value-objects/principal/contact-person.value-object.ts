export class ContactPerson {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('聯絡人姓名不能為空');
    }
    if (value.trim().length > 50) {
      throw new Error('聯絡人姓名不能超過 50 個字符');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ContactPerson): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): ContactPerson {
    return new ContactPerson(value);
  }
} 