/**
 * 是否匿名使用者值物件
 */
export class IsAnonymous {
  private readonly value: boolean;

  constructor(isAnonymous: boolean) {
    this.value = isAnonymous;
  }

  getValue(): boolean {
    return this.value;
  }

  isAnonymous(): boolean {
    return this.value;
  }

  static ANONYMOUS(): IsAnonymous {
    return new IsAnonymous(true);
  }

  static AUTHENTICATED(): IsAnonymous {
    return new IsAnonymous(false);
  }

  static fromFirebaseUser(user: any): IsAnonymous {
    return new IsAnonymous(user.isAnonymous || false);
  }
}
