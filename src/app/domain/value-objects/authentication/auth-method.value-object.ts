/**
 * 登入方式識別值物件
 */
export class AuthMethod {
  private readonly value: AuthMethodType;

  constructor(method: AuthMethodType) {
    this.value = method;
  }

  getValue(): AuthMethodType {
    return this.value;
  }

  static fromFirebaseUser(user: any): AuthMethod {
    if (user.isAnonymous) {
      return new AuthMethod(AuthMethodType.ANONYMOUS);
    }
    if (user.providerData && user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      return new AuthMethod(this.mapProviderId(providerId));
    }
    return new AuthMethod(AuthMethodType.PASSWORD);
  }

  private static mapProviderId(providerId: string): AuthMethodType {
    switch (providerId) {
      case 'google.com':
        return AuthMethodType.GOOGLE_COM;
      case 'facebook.com':
        return AuthMethodType.FACEBOOK_COM;
      case 'password':
        return AuthMethodType.PASSWORD;
      default:
        return AuthMethodType.PASSWORD;
    }
  }
}

export enum AuthMethodType {
  PASSWORD = 'password',
  GOOGLE_COM = 'google.com',
  FACEBOOK_COM = 'facebook.com',
  ANONYMOUS = 'anonymous'
}
