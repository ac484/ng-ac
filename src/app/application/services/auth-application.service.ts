/**
 * Authentication Application Service
 * 簡化：移除重複邏輯，使用統一驗證方法
 */
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Authentication, AuthResult, EmailAuthData } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { AuthDomainService } from '../../domain/services/auth-domain.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApplicationService {
  private readonly authRepository = inject(AUTH_REPOSITORY);
  private readonly authDomainService = inject(AuthDomainService);

  /**
   * Sign in with Google
   */
  signInWithGoogle(): Observable<AuthResult> {
    return this.authRepository.signInWithGoogle().pipe(
      map(result => this.validateAuthResult(result)),
      catchError(error => this.handleAuthError(error, 'Google sign in'))
    );
  }

  /**
   * Sign in anonymously
   */
  signInAnonymously(): Observable<AuthResult> {
    return this.authRepository.signInAnonymously().pipe(
      map(result => this.validateAuthResult(result)),
      catchError(error => this.handleAuthError(error, 'Anonymous sign in'))
    );
  }

  /**
   * Sign in with email and password
   */
  signInWithEmail(authData: EmailAuthData): Observable<AuthResult> {
    const validation = this.authDomainService.validateEmailAuthData(authData);
    if (!validation.success) {
      return from([validation]);
    }

    return this.authRepository.signInWithEmail(authData).pipe(
      map(result => this.validateAuthResult(result)),
      catchError(error => this.handleAuthError(error, 'Email sign in'))
    );
  }

  /**
   * Create user with email and password
   */
  createUserWithEmail(authData: EmailAuthData): Observable<AuthResult> {
    const validation = this.authDomainService.validateEmailAuthData(authData);
    if (!validation.success) {
      return from([validation]);
    }

    return this.authRepository.createUserWithEmail(authData).pipe(
      map(result => this.validateAuthResult(result)),
      catchError(error => this.handleAuthError(error, 'User creation'))
    );
  }

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Observable<AuthResult> {
    return this.authRepository.sendPasswordResetEmail(email).pipe(catchError(error => this.handleAuthError(error, 'Password reset email')));
  }

  /**
   * Sign out
   */
  signOut(): Observable<void> {
    return this.authRepository.signOut().pipe(
      catchError(error => {
        console.error('Sign out failed:', error);
        throw error;
      })
    );
  }

  /**
   * Get current authentication
   */
  getCurrentAuthentication(): Observable<Authentication | null> {
    return this.authRepository.getCurrentAuthentication().pipe(
      map(auth => {
        if (auth) {
          const validation = this.authDomainService.validateAuthentication(auth);
          if (!validation.success) {
            console.warn('Current authentication validation failed:', validation.message);
            return null;
          }
        }
        return auth;
      })
    );
  }

  /**
   * Get current user token
   */
  async getCurrentUserToken(): Promise<string | null> {
    return await this.authRepository.getCurrentUserToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authRepository.isAuthenticated();
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthResult> {
    return this.authRepository.refreshToken().pipe(
      map(result => this.validateAuthResult(result)),
      catchError(error => this.handleAuthError(error, 'Token refresh'))
    );
  }

  /**
   * Validate authentication token
   */
  validateToken(token: string): Observable<boolean> {
    return this.authRepository.validateToken(token);
  }

  /**
   * Check if user can perform action
   */
  canPerformAction(action: string): Observable<boolean> {
    return this.getCurrentAuthentication().pipe(
      map(auth => {
        if (!auth) return false;
        return this.authDomainService.canPerformAction(auth, action);
      })
    );
  }

  /**
   * Get user permissions
   */
  getUserPermissions(): Observable<string[]> {
    return this.getCurrentAuthentication().pipe(
      map(auth => {
        if (!auth) return [];
        return this.authDomainService.getUserPermissions(auth);
      })
    );
  }

  /**
   * Get authentication status
   */
  async getAuthenticationStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
    try {
      const auth = await this.getCurrentAuthentication().toPromise();
      return {
        isAuthenticated: !!auth,
        user: auth?.getUser() || null
      };
    } catch (error) {
      console.error('Failed to get authentication status:', error);
      return { isAuthenticated: false };
    }
  }

  // 私有方法：統一驗證邏輯
  private validateAuthResult(result: AuthResult): AuthResult {
    if (result.success && result.user) {
      const auth = Authentication.fromFirebaseUser({ uid: result.user.id });
      const validation = this.authDomainService.validateAuthentication(auth);
      if (!validation.success) {
        return { ...result, success: false, message: validation.message };
      }
    }
    return result;
  }

  // 私有方法：統一錯誤處理
  private handleAuthError(error: any, operation: string): Observable<AuthResult> {
    console.error(`${operation} failed:`, error);
    return from([{ success: false, message: `${operation} failed`, error }]);
  }
}
