/**
 * Authentication domain service
 * Handles authentication business logic and validation rules
 */
import { Injectable } from '@angular/core';
import { Authentication, AuthResult, EmailAuthData, AuthProvider } from '../entities/auth.entity';
import { User } from '../entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthDomainService {

  /**
   * Validate email authentication data
   * 改進：通過實體進行驗證，而不是直接創建值物件
   */
  validateEmailAuthData(authData: EmailAuthData): AuthResult {
    try {
      // 創建臨時用戶實體進行驗證
      const tempUser = User.create(
        'temp_id',
        authData.email,
        authData.displayName || 'Temp User',
        undefined,
        false,
        false,
        'email',
        'password'
      );

      // 通過實體進行驗證
      const validation = tempUser.validate();
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      // 驗證密碼
      if (!authData.password || authData.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // 驗證顯示名稱
      if (authData.displayName && authData.displayName.trim().length === 0) {
        return {
          success: false,
          message: 'Display name cannot be empty'
        };
      }

      return {
        success: true,
        message: 'Validation successful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid email format',
        error
      };
    }
  }

  /**
   * Validate authentication state
   */
  validateAuthentication(auth: Authentication): AuthResult {
    if (!auth.isUserAuthenticated()) {
      return {
        success: false,
        message: 'User is not authenticated'
      };
    }

    if (!auth.isSessionValid()) {
      return {
        success: false,
        message: 'Authentication session has expired'
      };
    }

    return {
      success: true,
      message: 'Authentication is valid'
    };
  }

  /**
   * Create authentication result from domain entity
   */
  createAuthResult(auth: Authentication, success: boolean, message: string, error?: any): AuthResult {
    return {
      success,
      user: auth.getUser() || undefined,
      session: auth.getSession() || undefined,
      message,
      error
    };
  }

  /**
   * Validate provider type
   */
  validateProvider(provider: string): boolean {
    return Object.values(AuthProvider).includes(provider as AuthProvider);
  }

  /**
   * Check if user can perform action based on authentication
   */
  canPerformAction(auth: Authentication, action: string): boolean {
    if (!auth.isUserAuthenticated()) {
      return false;
    }

    // Add business rules for different actions
    switch (action) {
      case 'read':
        return true; // All authenticated users can read
      case 'write':
        return !auth.isUserAnonymous(); // Only non-anonymous users can write
      case 'admin':
        return auth.isEmailVerified() && !auth.isUserAnonymous(); // Only verified, non-anonymous users can admin
      default:
        return false;
    }
  }

  /**
   * Get user permissions based on authentication
   */
  getUserPermissions(auth: Authentication): string[] {
    const permissions: string[] = [];

    if (!auth.isUserAuthenticated()) {
      return permissions;
    }

    // Basic permissions for all authenticated users
    permissions.push('read');

    // Additional permissions for non-anonymous users
    if (!auth.isUserAnonymous()) {
      permissions.push('write');
    }

    // Admin permissions for verified, non-anonymous users
    if (auth.isEmailVerified() && !auth.isUserAnonymous()) {
      permissions.push('admin');
    }

    return permissions;
  }
} 