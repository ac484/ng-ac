export class ContactPhone {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('聯絡人電話不能為空');
    }
    
    // 允許的電話格式：+86-123-4567-8901 或 123-4567-8901 或 12345678901
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (!phoneRegex.test(value.trim())) {
      throw new Error('聯絡人電話格式不正確');
    }
    
    if (value.trim().length > 20) {
      throw new Error('聯絡人電話不能超過 20 個字符');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ContactPhone): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): ContactPhone {
    return new ContactPhone(value);
  }
} 