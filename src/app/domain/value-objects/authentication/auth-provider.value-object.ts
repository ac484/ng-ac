/**
 * 登入來源值物件
 */
export class AuthProvider {
  private readonly value: AuthProviderType;

  constructor(provider: AuthProviderType) {
    this.value = provider;
  }

  getValue(): AuthProviderType {
    return this.value;
  }

  static fromFirebaseUser(user: any): AuthProvider {
    if (user.isAnonymous) {
      return new AuthProvider(AuthProviderType.ANONYMOUS);
    }
    if (user.providerData && user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      return new AuthProvider(this.mapProviderId(providerId));
    }
    return new AuthProvider(AuthProviderType.EMAIL);
  }

  private static mapProviderId(providerId: string): AuthProviderType {
    switch (providerId) {
      case 'google.com':
        return AuthProviderType.GOOGLE;
      case 'facebook.com':
        return AuthProviderType.FACEBOOK;
      case 'password':
        return AuthProviderType.EMAIL;
      default:
        return AuthProviderType.EMAIL;
    }
  }
}

export enum AuthProviderType {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  ANONYMOUS = 'anonymous'
} 