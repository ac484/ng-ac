/**
 * 信箱是否驗證值物件
 */
export class VerificationStatus {
  private readonly value: boolean;
  private readonly verifiedAt: Date | null;

  constructor(verified: boolean, verifiedAt: Date | null = null) {
    this.value = verified;
    this.verifiedAt = verifiedAt;
  }

  isVerified(): boolean {
    return this.value;
  }

  getVerifiedAt(): Date | null {
    return this.verifiedAt ? new Date(this.verifiedAt) : null;
  }

  static VERIFIED(verifiedAt: Date = new Date()): VerificationStatus {
    return new VerificationStatus(true, verifiedAt);
  }

  static UNVERIFIED(): VerificationStatus {
    return new VerificationStatus(false);
  }
}
