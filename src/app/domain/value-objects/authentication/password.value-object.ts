/**
 * 使用者密碼值物件
 */
export class Password {
  private readonly value: string;
  private readonly hashedValue: string;

  constructor(password: string) {
    this.validatePassword(password);
    this.value = password;
    this.hashedValue = this.hashPassword(password);
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain uppercase, lowercase, and number');
    }
  }

  private hashPassword(password: string): string {
    // 實際實現中應使用 bcrypt 或其他安全哈希算法
    return btoa(password);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  verifyPassword(inputPassword: string): boolean {
    return this.hashPassword(inputPassword) === this.hashedValue;
  }
} 