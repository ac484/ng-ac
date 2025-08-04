import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from '@delon/auth';
import { User } from '../../domain/entities/user.entity';
import { Authentication } from '../../domain/entities/auth.entity';
import { ErrorHandlerService } from './error-handler.service';

/**
 * 統一認證服務
 * 移除重複代碼，使用統一錯誤處理
 */
@Injectable({
  providedIn: 'root'
})
export class UnifiedAuthenticationService {
  constructor(
    private tokenService: TokenService,
    private message: NzMessageService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  /**
   * 匿名登入
   */
  async signInAnonymously(): Promise<AuthenticationResult> {
    return this.performLogin('anonymous', 'Anonymous User', true);
  }

  /**
   * 快速匿名登入（簡化版本）
   */
  async quickAnonymousLogin(): Promise<boolean> {
    const result = await this.signInAnonymously();
    return result.success;
  }

  /**
   * 電子郵件登入
   */
  async signInWithEmail(emailStr: string, passwordStr: string): Promise<AuthenticationResult> {
    return this.performLogin('email', emailStr.split('@')[0], false, emailStr);
  }

  /**
   * 快速郵箱登入（簡化版本）
   */
  async quickEmailLogin(emailStr: string, passwordStr: string): Promise<boolean> {
    const result = await this.signInWithEmail(emailStr, passwordStr);
    return result.success;
  }

  /**
   * 登出
   */
  async signOut(): Promise<void> {
    try {
      await this.tokenService.clear();
      this.errorHandler.handleSuccess('登出成功');
      this.router.navigate(['/auth/login']);
    } catch (error: unknown) {
      this.errorHandler.handleAuthError(error, '登出');
      throw error;
    }
  }

  /**
   * 快速登出（簡化版本）
   */
  async quickLogout(): Promise<void> {
    await this.signOut();
  }

  /**
   * 檢查認證狀態
   */
  async checkAuthState(): Promise<boolean> {
    const token = this.tokenService.get();
    if (!token) {
      return false;
    }

    try {
      const auth = Authentication.fromTokenModel(token);
      return auth.isSessionValid();
    } catch {
      return false;
    }
  }

  /**
   * 檢查是否已認證（簡化版本）
   */
  isAuthenticated(): boolean {
    const token = this.tokenService.get();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * 獲取當前用戶信息
   */
  getCurrentUser(): any {
    const token = this.tokenService.get();
    if (!token) return null;

    return {
      id: token.id,
      name: token.name,
      email: token.email,
      avatar: token.avatar,
      isAnonymous: token.firebase?.isAnonymous || false,
      emailVerified: token.firebase?.emailVerified || false
    };
  }

  // 私有方法：統一的登入邏輯
  private async performLogin(
    type: 'anonymous' | 'email', 
    displayName: string, 
    isAnonymous: boolean, 
    email?: string
  ): Promise<AuthenticationResult> {
    try {
      const user = this.createUser(type, displayName, isAnonymous, email);
      const auth = this.createAuth(user, type);
      const tokenModel = auth.toTokenModel();

      await this.tokenService.set(tokenModel);
      this.errorHandler.handleSuccess(`${isAnonymous ? '匿名' : ''}登入成功`);
      this.router.navigate(['/']);

      return {
        success: true,
        token: tokenModel.token,
        isAnonymous
      };
    } catch (error: unknown) {
      this.errorHandler.handleAuthError(error, '登入');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // 私有方法：創建用戶
  private createUser(type: string, displayName: string, isAnonymous: boolean, email?: string): User {
    if (type === 'anonymous') {
      return User.createAnonymous();
    } else {
      return User.create(
        'user_' + Date.now(),
        email || '',
        displayName,
        undefined,
        false,
        true,
        'email',
        'password'
      );
    }
  }

  // 私有方法：創建認證實體
  private createAuth(user: User, type: string): Authentication {
    return Authentication.fromFirebaseUser({
      uid: user.id,
      email: user.email.getValue(),
      displayName: user.displayName.getValue(),
      photoURL: user.photoUrl.getValue(),
      emailVerified: user.isEmailVerified.isVerified(),
      isAnonymous: user.isAnonymous.isAnonymous(),
      providerId: type === 'anonymous' ? 'anonymous' : 'password',
      metadata: {
        creationTime: user.createdAt.toISOString(),
        lastSignInTime: user.updatedAt.toISOString()
      }
    });
  }

  // 私有方法：檢查Token是否過期
  private isTokenExpired(token: any): boolean {
    return token.expired && Date.now() > token.expired;
  }
}

interface AuthenticationResult {
  success: boolean;
  user?: any;
  token?: string;
  isAnonymous?: boolean;
  error?: string;
} 