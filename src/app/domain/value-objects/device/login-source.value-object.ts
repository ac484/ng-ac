/**
 * 登入觸發來源值物件
 */
export class LoginSource {
  private readonly value: LoginSourceType;

  constructor(source: LoginSourceType) {
    this.value = source;
  }

  getValue(): LoginSourceType {
    return this.value;
  }

  static WEB(): LoginSource {
    return new LoginSource(LoginSourceType.WEB);
  }

  static MOBILE(): LoginSource {
    return new LoginSource(LoginSourceType.MOBILE);
  }

  static API(): LoginSource {
    return new LoginSource(LoginSourceType.API);
  }

  static ADMIN_PANEL(): LoginSource {
    return new LoginSource(LoginSourceType.ADMIN_PANEL);
  }
}

export enum LoginSourceType {
  WEB = 'Web',
  MOBILE = 'Mobile',
  API = 'API',
  ADMIN_PANEL = 'AdminPanel'
} 