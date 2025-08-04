import { Injectable } from '@angular/core';
import { TokenService, ITokenModel } from '@delon/auth';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';

// 值物件導入
import { Email } from '../../domain/value-objects/authentication/email.value-object';
import { IsAnonymous } from '../../domain/value-objects/status/is-anonymous.value-object';
import { AuthProvider } from '../../domain/value-objects/authentication/auth-provider.value-object';
import { IsEmailVerified } from '../../domain/value-objects/status/is-email-verified.value-object';
import { JWTToken } from '../../domain/value-objects/token/jwt-token.value-object';
import { TokenExpiresAt } from '../../domain/value-objects/token/token-expires-at.value-object';
import { SessionId } from '../../domain/value-objects/authentication/session-id.value-object';
import { DeviceInfo } from '../../domain/value-objects/device/device-info.value-object';
import { LoginSource } from '../../domain/value-objects/device/login-source.value-object';
import { GeoLocation } from '../../domain/value-objects/device/geo-location.value-object';
import { LoginContext } from '../../domain/value-objects/device/login-context.value-object';

/**
 * @delon/auth 適配器
 * 整合 @delon/auth 與值物件系統
 */
@Injectable({
  providedIn: 'root'
})
export class DelonAuthAdapter {
  private authStateSubject = new Subject<ITokenModel | null>();

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private message: NzMessageService
  ) {}

  /**
   * 設置認證 Token
   */
  async setToken(tokenModel: ITokenModel): Promise<void> {
    try {
      const success = await this.tokenService.set(tokenModel);
      if (!success) {
        throw new Error('Failed to set token');
      }

      // 觸發認證狀態變更
      this.authStateSubject.next(tokenModel);
    } catch (error) {
      this.message.error('Token 設置失敗');
      throw error;
    }
  }

  /**
   * 獲取當前 Token
   */
  getToken(): ITokenModel | null {
    return this.tokenService.get();
  }

  /**
   * 清除認證 Token
   */
  async clearToken(): Promise<void> {
    try {
      await this.tokenService.clear();
      
      // 觸發認證狀態變更
      this.authStateSubject.next(null);
    } catch (error) {
      this.message.error('Token 清除失敗');
      throw error;
    }
  }

  /**
   * 檢查是否已認證
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || !token.token) {
      return false;
    }

    try {
      const jwtToken = new JWTToken(token.token);
      return !jwtToken.isExpired();
    } catch {
      return false;
    }
  }

  /**
   * 檢查 Token 是否過期
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token || !token.token) {
      return true;
    }

    try {
      const jwtToken = new JWTToken(token.token);
      return jwtToken.isExpired();
    } catch {
      return true;
    }
  }

  /**
   * 創建匿名用戶 Token
   */
  createAnonymousToken(): ITokenModel {
    const sessionId = SessionId.generate();
    const email = Email.createAnonymous();
    const isAnonymous = IsAnonymous.ANONYMOUS();
    const authProvider = new AuthProvider('anonymous' as any);
    const isEmailVerified = IsEmailVerified.UNVERIFIED();

    return {
      token: `anon_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: 'Anonymous User',
      email: email.getValue(),
      id: sessionId.getValue(),
      avatar: '',
      time: +new Date(),
      expired: Date.now() + (60 * 60 * 1000), // 1 hour
      firebase: {
        uid: sessionId.getValue(),
        emailVerified: isEmailVerified.getValue(),
        isAnonymous: isAnonymous.getValue(),
        providerId: authProvider.getValue(),
        providerData: []
      }
    };
  }

  /**
   * 創建郵箱用戶 Token
   */
  createEmailToken(
    email: Email,
    userId: string,
    displayName: string,
    photoURL: string = '',
    isEmailVerified: boolean = false
  ): ITokenModel {
    const sessionId = SessionId.generate();
    const isAnonymous = IsAnonymous.AUTHENTICATED();
    const authProvider = new AuthProvider('email' as any);

    return {
      token: `email_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: displayName,
      email: email.getValue(),
      id: userId,
      avatar: photoURL,
      time: +new Date(),
      expired: Date.now() + (60 * 60 * 1000), // 1 hour
      firebase: {
        uid: userId,
        emailVerified: isEmailVerified,
        isAnonymous: isAnonymous.getValue(),
        providerId: authProvider.getValue(),
        providerData: []
      }
    };
  }

  /**
   * 創建 Google 用戶 Token
   */
  createGoogleToken(
    email: Email,
    userId: string,
    displayName: string,
    photoURL: string = '',
    isEmailVerified: boolean = true
  ): ITokenModel {
    const sessionId = SessionId.generate();
    const isAnonymous = IsAnonymous.AUTHENTICATED();
    const authProvider = new AuthProvider('google' as any);

    return {
      token: `google_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: displayName,
      email: email.getValue(),
      id: userId,
      avatar: photoURL,
      time: +new Date(),
      expired: Date.now() + (60 * 60 * 1000), // 1 hour
      firebase: {
        uid: userId,
        emailVerified: isEmailVerified,
        isAnonymous: isAnonymous.getValue(),
        providerId: authProvider.getValue(),
        providerData: []
      }
    };
  }

  /**
   * 轉換 Token 為用戶對象
   */
  private convertTokenToUser(token: ITokenModel): any {
    return {
      id: token['id'],
      name: token['name'],
      email: token['email'],
      avatar: token['avatar'],
      isAnonymous: token['firebase']?.isAnonymous || false,
      emailVerified: token['firebase']?.emailVerified || false,
      providerId: token['firebase']?.providerId || 'unknown'
    };
  }

  /**
   * 獲取登入上下文
   */
  async getLoginContext(): Promise<LoginContext> {
    const deviceInfo = DeviceInfo.fromBrowser();
    const loginSource = LoginSource.WEB();
    const geoLocation = await GeoLocation.fromIP('127.0.0.1'); // 實際實現中應獲取真實 IP
    
    return new LoginContext('127.0.0.1', deviceInfo, geoLocation, loginSource);
  }

  /**
   * 處理認證成功
   */
  async handleAuthenticationSuccess(tokenModel: ITokenModel, redirectUrl: string = '/'): Promise<void> {
    await this.setToken(tokenModel);
    this.message.success('認證成功');
    await this.router.navigate([redirectUrl]);
  }

  /**
   * 處理認證失敗
   */
  handleAuthenticationError(error: any, errorMessage: string = '認證失敗'): void {
    this.message.error(errorMessage);
    console.error('Authentication error:', error);
  }

  /**
   * 處理登出
   */
  async handleLogout(redirectUrl: string = '/auth/login'): Promise<void> {
    await this.clearToken();
    this.message.success('登出成功');
    await this.router.navigate([redirectUrl]);
  }

  /**
   * 檢查權限
   */
  hasPermission(permission: string): boolean {
    const token = this.getToken();
    if (!token || !token.token) {
      return false;
    }

    try {
      const jwtToken = new JWTToken(token.token);
      const permissions = jwtToken.getClaim('permissions') || [];
      return permissions.includes(permission);
    } catch {
      return false;
    }
  }

  /**
   * 檢查角色
   */
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token || !token.token) {
      return false;
    }

    try {
      const jwtToken = new JWTToken(token.token);
      const roles = jwtToken.getClaim('roles') || [];
      return roles.includes(role);
    } catch {
      return false;
    }
  }

  /**
   * 獲取認證狀態變更 Observable
   */
  getAuthStateChanges(): Observable<ITokenModel | null> {
    return this.authStateSubject.asObservable();
  }
} 