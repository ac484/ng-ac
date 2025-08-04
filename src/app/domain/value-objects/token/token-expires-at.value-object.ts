/**
 * Token 過期時間值物件
 */
export class TokenExpiresAt {
  private readonly value: Date;

  constructor(expiresAt: Date) {
    this.value = new Date(expiresAt);
  }

  getValue(): Date {
    return new Date(this.value);
  }

  isExpired(): boolean {
    return new Date() > this.value;
  }

  getTimeUntilExpiry(): number {
    return this.value.getTime() - new Date().getTime();
  }

  static fromTimestamp(timestamp: number): TokenExpiresAt {
    return new TokenExpiresAt(new Date(timestamp * 1000));
  }
}
