/**
 * 使用者信箱值物件
 */
export class Email {
  private readonly value: string;
  private readonly isAnonymous: boolean;
  private readonly isValidEmail: boolean;

  constructor(email: string | null) {
    if (email === null || email === undefined) {
      this.value = this.generateAnonymousEmail();
      this.isAnonymous = true;
      this.isValidEmail = false;
    } else {
      const trimmedEmail = email.trim();
      if (this.isValidEmailFormat(trimmedEmail)) {
        this.value = trimmedEmail.toLowerCase();
        this.isAnonymous = false;
        this.isValidEmail = true;
      } else {
        this.value = this.generateTemporaryEmail(trimmedEmail);
        this.isAnonymous = false;
        this.isValidEmail = false;
      }
    }
  }

  static fromFirebaseUser(user: any): Email {
    if (!user || !user.email) {
      return Email.createAnonymous();
    }
    return new Email(user.email);
  }

  static createAnonymous(): Email {
    return new Email(null);
  }

  getValue(): string {
    return this.value;
  }

  toLowerCase(): string {
    return this.value.toLowerCase();
  }

  toUpperCase(): string {
    return this.value.toUpperCase();
  }

  includes(searchString: string): boolean {
    return this.value.toLowerCase().includes(searchString.toLowerCase());
  }

  isAnonymousEmail(): boolean {
    return this.isAnonymous;
  }

  isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateAnonymousEmail(): string {
    return `anonymous_${Date.now()}@anonymous.local`;
  }

  private generateTemporaryEmail(input: string): string {
    return `temp_${Date.now()}_${input.replace(/[^a-zA-Z0-9]/g, '')}@temp.local`;
  }
}
