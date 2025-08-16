/**
 * @fileoverview Firebase Auth 服務 (Firebase Auth Service)
 * @description 提供 Firebase 身份驗證功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Firebase Auth Service
 * - 職責：Firebase 身份驗證、用戶管理
 * - 依賴：@angular/fire/auth, FirebaseService
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供 Firebase 身份驗證功能
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private auth: Auth;

  constructor(private firebaseService: FirebaseService) {
    this.auth = this.firebaseService.getAuth();
  }

  /**
   * 使用郵箱和密碼登錄
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('登錄失敗:', error);
      return null;
    }
  }

  /**
   * 使用郵箱和密碼註冊
   */
  async register(email: string, password: string): Promise<User | null> {
    try {
      const result: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('註冊失敗:', error);
      return null;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }

  /**
   * 獲取當前用戶
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * 檢查是否已登錄
   */
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  /**
   * 獲取當前用戶 ID
   */
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  /**
   * 獲取當前用戶郵箱
   */
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  /**
   * 監聽認證狀態變化
   */
  onAuthStateChanged(): Observable<User | null> {
    return new Observable(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });

      return () => unsubscribe();
    });
  }

  /**
   * 獲取認證狀態
   */
  getAuthState(): Observable<User | null> {
    return this.onAuthStateChanged();
  }

  /**
   * 檢查用戶是否已驗證郵箱
   */
  isEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified || false;
  }
}
