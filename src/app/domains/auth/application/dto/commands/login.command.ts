/**
 * 登入命令
 */
export class LoginCommand {
  constructor(
    public readonly type: 'email' | 'google',
    public readonly email?: string,
    public readonly password?: string
  ) {}

  /**
   * 創建郵箱登入命令
   */
  static createEmailLogin(email: string, password: string): LoginCommand {
    return new LoginCommand('email', email, password);
  }

  /**
   * 創建 Google 登入命令
   */
  static createGoogleLogin(): LoginCommand {
    return new LoginCommand('google');
  }
}
