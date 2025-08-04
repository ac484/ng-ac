/**
 * JWT Token 值物件
 */
export class JWTToken {
  private readonly token: string;
  private readonly payload: any;
  private readonly expiresAt: Date;

  constructor(token: string) {
    this.token = token;
    this.payload = this.decodeToken(token);
    this.expiresAt = new Date(this.payload.exp * 1000);
  }

  getToken(): string {
    return this.token;
  }

  getPayload(): any {
    return { ...this.payload };
  }

  getExpiresAt(): Date {
    return new Date(this.expiresAt);
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  getClaim(key: string): any {
    return this.payload[key];
  }

  private decodeToken(token: string): any {
    try {
      // 實際實現中應使用 jwt-decode 庫
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      throw new Error('Invalid JWT token format');
    }
  }

  static fromDelonToken(tokenModel: any): JWTToken {
    return new JWTToken(tokenModel.token);
  }
} 