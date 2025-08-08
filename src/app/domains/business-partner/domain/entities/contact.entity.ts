/**
 * 聯絡人實體
 * 極簡設計，只包含核心屬性和方法
 */
export interface ContactProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export class Contact {
  constructor(
    public readonly name: string,
    public readonly title: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly isPrimary: boolean
  ) {}

  static create(props: ContactProps): Contact {
    // 基本驗證
    if (!props.name?.trim()) throw new Error('Contact name is required');
    if (!props.email?.trim()) throw new Error('Contact email is required');

    return new Contact(
      props.name.trim(),
      props.title?.trim() || '',
      props.email.trim(),
      props.phone?.trim() || '',
      props.isPrimary || false
    );
  }

  // 不可變更新方法
  updateName(name: string): Contact {
    return new Contact(name, this.title, this.email, this.phone, this.isPrimary);
  }

  updateEmail(email: string): Contact {
    return new Contact(this.name, this.title, email, this.phone, this.isPrimary);
  }

  setAsPrimary(): Contact {
    return new Contact(this.name, this.title, this.email, this.phone, true);
  }

  // 顯示方法
  getDisplayName(): string {
    return this.title ? `${this.name} (${this.title})` : this.name;
  }

  // 驗證方法
  isValid(): boolean {
    return !!(this.name?.trim() && this.email?.trim());
  }
}
