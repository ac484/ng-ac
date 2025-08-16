/**
 * @fileoverview Firebase 認證服務 (Firebase Authentication Service)
 * @description 提供 Firebase 身份驗證功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Security Layer Authentication Service
 * - 職責：Firebase 身份驗證
 * - 依賴：Firebase Auth Service
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供基本的身份驗證功能
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FirebaseAuthService as InfrastructureFirebaseAuthService } from '../../../infrastructure/persistence/firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  constructor(
    private firebaseAuthService: InfrastructureFirebaseAuthService
  ) {}

  /**
   * 使用郵箱和密碼登錄
   */
  async login(email: string, password: string): Promise<User | null> {
    return await this.firebaseAuthService.login(email, password);
  }

  /**
   * 使用郵箱和密碼註冊
   */
  async register(email: string, password: string): Promise<User | null> {
    return await this.firebaseAuthService.register(email, password);
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    await this.firebaseAuthService.logout();
  }

  /**
   * 獲取當前用戶
   */
  getCurrentUser(): User | null {
    return this.firebaseAuthService.getCurrentUser();
  }

  /**
   * 檢查是否已登錄
   */
  isLoggedIn(): boolean {
    return this.firebaseAuthService.isLoggedIn();
  }

  /**
   * 獲取當前用戶 ID
   */
  getCurrentUserId(): string | null {
    return this.firebaseAuthService.getCurrentUserId();
  }

  /**
   * 獲取當前用戶郵箱
   */
  getCurrentUserEmail(): string | null {
    return this.firebaseAuthService.getCurrentUserEmail();
  }

  /**
   * 檢查用戶是否已驗證郵箱
   */
  isEmailVerified(): boolean {
    return this.firebaseAuthService.isEmailVerified();
  }
}
