/**
 * 是否已驗證信箱值物件
 */
export class IsEmailVerified {
  private readonly value: boolean;
  private readonly verifiedAt: Date | null;

  constructor(verified: boolean, verifiedAt: Date | null = null) {
    this.value = verified;
    this.verifiedAt = verifiedAt;
  }

  getValue(): boolean {
    return this.value;
  }

  isVerified(): boolean {
    return this.value;
  }

  getVerifiedAt(): Date | null {
    return this.verifiedAt ? new Date(this.verifiedAt) : null;
  }

  static VERIFIED(verifiedAt: Date = new Date()): IsEmailVerified {
    return new IsEmailVerified(true, verifiedAt);
  }

  static UNVERIFIED(): IsEmailVerified {
    return new IsEmailVerified(false);
  }

  static fromFirebaseUser(user: any): IsEmailVerified {
    return new IsEmailVerified(user.emailVerified || false);
  }
}
