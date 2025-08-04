/**
 * @deprecated 此服務已被 UnifiedAuthenticationService 取代
 * 請使用 UnifiedAuthenticationService 替代
 *
 * 重複代碼已移除，統一使用 UnifiedAuthenticationService
 *
 * 遷移指南：
 * - quickAnonymousLogin() → signInAnonymously() 或 quickAnonymousLogin()
 * - quickEmailLogin() → signInWithEmail() 或 quickEmailLogin()
 * - quickLogout() → signOut() 或 quickLogout()
 * - isAuthenticated() → isAuthenticated()
 * - getCurrentUser() → getCurrentUser()
 */

import { Injectable } from '@angular/core';

import { UnifiedAuthenticationService } from './unified-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SimplifiedAuthService {
  constructor(private unifiedAuth: UnifiedAuthenticationService) {}

  // 重定向到統一認證服務
  async quickAnonymousLogin(): Promise<boolean> {
    return this.unifiedAuth.quickAnonymousLogin();
  }

  async quickEmailLogin(emailStr: string, passwordStr: string): Promise<boolean> {
    return this.unifiedAuth.quickEmailLogin(emailStr, passwordStr);
  }

  async quickLogout(): Promise<void> {
    return this.unifiedAuth.quickLogout();
  }

  isAuthenticated(): boolean {
    return this.unifiedAuth.isAuthenticated();
  }

  getCurrentUser(): any {
    return this.unifiedAuth.getCurrentUser();
  }
}
