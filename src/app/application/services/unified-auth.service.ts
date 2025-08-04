import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from '@delon/auth';
import { User } from '../../domain/entities/user.entity';
import { Authentication } from '../../domain/entities/auth.entity';

/**
 * 統一認證服務
 * 合併所有認證功能，添加緩存機制提高效能
 */
@Injectable({
  providedIn: 'root'
})
export class UnifiedAuthService {
  // 緩存機制
  private userCache = new Map<string, User>();
  private authCache = new Map<string, Authentication>();
  private tokenValidationCache = new Map<string, { isValid: boolean; timestamp: number }>();

  constructor(
    private tokenService: TokenService,
    private message: NzMessageService,
    private router: Router
  ) { }

  /**
   * 匿名登入（帶緩存）
   */
  async signInAnonymously(): Promise<AuthenticationResult> {
    try {
      const cacheKey = 'anonymous';
      let user = this.userCache.get(cacheKey);

      if (!user) {
        user = User.createAnonymous();
        this.userCache.set(cacheKey, user);
      }

      const auth = this.createOrGetCachedAuth(user, 'anonymous');
      const tokenModel = auth.toTokenModel();

      await this.tokenService.set(tokenModel);
      this.message.success('匿名登入成功');
      this.router.navigate(['/']);

      return {
        success: true,
        token: tokenModel.token,
        isAnonymous: true
      };
    } catch (error: unknown) {
      this.message.error('登入失敗');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 電子郵件登入（帶緩存）
   */
  async signInWithEmail(emailStr: string, passwordStr: string): Promise<AuthenticationResult> {
    try {
      const cacheKey = `email_${emailStr}`;
      let user = this.userCache.get(cacheKey);

      if (!user) {
        user = User.create({
          email: emailStr,
          displayName: emailStr.split('@')[0],
          authProvider: 'email'
        });
        user.verifyEmail(); // Mark as verified
        this.userCache.set(cacheKey, user);
      }

      const auth = this.createOrGetCachedAuth(user, 'password');
      const tokenModel = auth.toTokenModel();

      await this.tokenService.set(tokenModel);
      this.message.success('登入成功');
      this.router.navigate(['/']);

      return {
        success: true,
        token: tokenModel.token,
        isAnonymous: false
      };
    } catch (error: unknown) {
      this.message.error('登入失敗');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 快速登入（簡化版本）
   */
  async quickLogin(type: 'anonymous' | 'email', email?: string, password?: string): Promise<boolean> {
    try {
      if (type === 'anonymous') {
        const result = await this.signInAnonymously();
        return result.success;
      } else if (type === 'email' && email && password) {
        const result = await this.signInWithEmail(email, password);
        return result.success;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 登出
   */
  async signOut(): Promise<void> {
    try {
      await this.tokenService.clear();
      this.clearCache(); // 清除緩存
      this.message.success('登出成功');
      this.router.navigate(['/auth/login']);
    } catch (error: unknown) {
      this.message.error('登出失敗');
      throw error;
    }
  }

  /**
   * 檢查認證狀態（帶緩存）
   */
  async checkAuthState(): Promise<boolean> {
    const token = this.tokenService.get();
    if (!token) {
      return false;
    }

    const cacheKey = `token_${token.token}`;
    const cached = this.tokenValidationCache.get(cacheKey);

    // 緩存5分鐘
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.isValid;
    }

    try {
      const auth = Authentication.fromTokenModel(token);
      const isValid = auth.isSessionValid();

      this.tokenValidationCache.set(cacheKey, {
        isValid,
        timestamp: Date.now()
      });

      return isValid;
    } catch {
      return false;
    }
  }

  /**
   * 獲取當前用戶信息（帶緩存）
   */
  getCurrentUser(): any {
    const token = this.tokenService.get();
    if (!token) return null;

    const cacheKey = `user_${token.id}`;
    const cached = this.userCache.get(cacheKey);

    if (cached) {
      return cached.getSummary();
    }

    return {
      id: token.id,
      name: token.name,
      email: token.email,
      avatar: token.avatar,
      isAnonymous: token.firebase?.isAnonymous || false,
      emailVerified: token.firebase?.emailVerified || false
    };
  }

  /**
   * 檢查是否已認證（高效版本）
   */
  isAuthenticated(): boolean {
    const token = this.tokenService.get();
    if (!token) return false;

    const cacheKey = `auth_${token.token}`;
    const cached = this.tokenValidationCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.isValid;
    }

    const isValid = !this.isTokenExpired(token);
    this.tokenValidationCache.set(cacheKey, {
      isValid,
      timestamp: Date.now()
    });

    return isValid;
  }

  // 私有方法：創建或獲取緩存的認證實體
  private createOrGetCachedAuth(user: User, providerId: string): Authentication {
    const cacheKey = `auth_${user.id}_${providerId}`;
    let auth = this.authCache.get(cacheKey);

    if (!auth) {
      auth = Authentication.fromFirebaseUser({
        uid: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.isEmailVerified,
        isAnonymous: user.isAnonymous,
        providerId,
        metadata: {
          creationTime: user.createdAt.toISOString(),
          lastSignInTime: user.updatedAt.toISOString()
        }
      });
      this.authCache.set(cacheKey, auth);
    }

    return auth;
  }

  // 私有方法：清除緩存
  private clearCache(): void {
    this.userCache.clear();
    this.authCache.clear();
    this.tokenValidationCache.clear();
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