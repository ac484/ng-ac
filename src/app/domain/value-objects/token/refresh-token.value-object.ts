/**
 * Refresh Token 值物件
 */
export class RefreshToken {
  private readonly token: string | null;
  private readonly expiresAt: Date | null;

  constructor(token: string | null, expiresAt: Date | null = null) {
    this.token = token;
    this.expiresAt = expiresAt;
  }

  getToken(): string | null {
    return this.token;
  }

  getExpiresAt(): Date | null {
    return this.expiresAt ? new Date(this.expiresAt) : null;
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  hasToken(): boolean {
    return this.token !== null;
  }
}
