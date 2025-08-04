export class ContactEmail {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.trim().toLowerCase();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('聯絡人郵箱不能為空');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      throw new Error('聯絡人郵箱格式不正確');
    }
    
    if (value.trim().length > 100) {
      throw new Error('聯絡人郵箱不能超過 100 個字符');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ContactEmail): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): ContactEmail {
    return new ContactEmail(value);
  }
} 