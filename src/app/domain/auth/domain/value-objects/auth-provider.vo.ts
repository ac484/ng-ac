import { ValueObject } from '../../../../shared/domain/value-object';

export enum AuthProviderType {
    EMAIL = 'email',
    GOOGLE = 'google',
    ANONYMOUS = 'anonymous'
}

export class AuthProvider extends ValueObject<{ value: AuthProviderType }> {
  private constructor(props: { value: AuthProviderType }) {
    super(props);
  }

  public static create(value: AuthProviderType): AuthProvider {
    return new AuthProvider({ value });
  }

  get value(): AuthProviderType {
    return this.props.value;
  }
}
