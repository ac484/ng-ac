/**
 * Firebase 認證服務
 *
 * 整合 @angular/fire 與 @delon/auth，提供統一的認證介面
 * 確保 Firebase 認證與既有的 token 管理流程無縫銜接
 */

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, SocialService, ITokenModel } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { StartupService } from './startup.service';

export interface FirebaseAuthResult {
  success: boolean;
  user?: User;
  error?: any;
  message?: string;
}

export interface EmailAuthData {
  email: string;
  password: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly socialService = inject(SocialService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly settingsService = inject(SettingsService);
  private readonly startupService = inject(StartupService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });

  constructor() {
    // 監聽認證狀態變化
    this.initAuthStateListener();
  }

  /**
   * 初始化認證狀態監聽器
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        console.log('Firebase 用戶已登入:', user.uid);
      } else {
        console.log('Firebase 用戶已登出');
      }
    });
  }

  /**
   * Google 登入
   */
  signInWithGoogle(): Observable<FirebaseAuthResult> {
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      map(result => ({
        success: true,
        user: result.user,
        message: 'Google 登入成功'
      })),
      catchError(error => {
        console.error('Google 登入失敗:', error);
        let message = 'Google 登入失敗';

        if (error.code === 'auth/popup-closed-by-user') {
          message = '登入視窗已關閉';
        } else if (error.code === 'auth/popup-blocked') {
          message = '彈出視窗被阻擋，請允許彈出視窗';
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * 匿名登入
   */
  signInAnonymously(): Observable<FirebaseAuthResult> {
    return from(signInAnonymously(this.auth)).pipe(
      map(result => ({
        success: true,
        user: result.user,
        message: '匿名登入成功'
      })),
      catchError(error => {
        console.error('匿名登入失敗:', error);
        return throwError(() => ({
          success: false,
          error,
          message: '匿名登入失敗，請稍後再試'
        }));
      })
    );
  }

  /**
   * 郵箱登入
   */
  signInWithEmail(authData: EmailAuthData): Observable<FirebaseAuthResult> {
    return from(signInWithEmailAndPassword(this.auth, authData.email, authData.password)).pipe(
      map(result => ({
        success: true,
        user: result.user,
        message: '郵箱登入成功'
      })),
      catchError(error => {
        console.error('郵箱登入失敗:', error);
        let message = '登入失敗，請稍後再試';

        switch (error.code) {
          case 'auth/user-not-found':
            message = '用戶不存在';
            break;
          case 'auth/wrong-password':
            message = '密碼錯誤';
            break;
          case 'auth/invalid-email':
            message = '郵箱格式無效';
            break;
          case 'auth/user-disabled':
            message = '用戶帳號已被停用';
            break;
          case 'auth/too-many-requests':
            message = '登入嘗試次數過多，請稍後再試';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * 郵箱註冊
   */
  createUserWithEmail(authData: EmailAuthData): Observable<FirebaseAuthResult> {
    return from(createUserWithEmailAndPassword(this.auth, authData.email, authData.password)).pipe(
      switchMap(async result => {
        // 如果提供了顯示名稱，更新用戶資料
        if (authData.displayName && result.user) {
          await updateProfile(result.user, { displayName: authData.displayName });
        }
        return {
          success: true,
          user: result.user,
          message: '註冊成功'
        };
      }),
      catchError(error => {
        console.error('郵箱註冊失敗:', error);
        let message = '註冊失敗，請稍後再試';

        switch (error.code) {
          case 'auth/email-already-in-use':
            message = '此郵箱已被使用';
            break;
          case 'auth/invalid-email':
            message = '郵箱格式無效';
            break;
          case 'auth/weak-password':
            message = '密碼強度不足，請使用至少6個字符';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * 發送密碼重設郵件
   */
  sendPasswordResetEmail(email: string): Observable<FirebaseAuthResult> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => ({
        success: true,
        message: '密碼重設郵件已發送，請檢查您的郵箱'
      })),
      catchError(error => {
        console.error('發送密碼重設郵件失敗:', error);
        let message = '發送失敗，請稍後再試';

        switch (error.code) {
          case 'auth/user-not-found':
            message = '此郵箱未註冊';
            break;
          case 'auth/invalid-email':
            message = '郵箱格式無效';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * 登出
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        // 清除 @delon/auth 的 token
        this.tokenService.clear();
        // 清除用戶設定
        this.settingsService.setUser({});
        // 清空路由復用信息
        this.reuseTabService?.clear();
        console.log('Firebase 登出成功');
      }),
      catchError(error => {
        console.error('Firebase 登出失敗:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 處理 Firebase 認證成功後的流程
   * 將 Firebase 用戶信息轉換為 @delon/auth 的 token 格式
   */
  async handleAuthSuccess(user: User): Promise<void> {
    try {
      // 獲取 Firebase ID Token
      const idToken = await user.getIdToken();

      // 構建 @delon/auth 兼容的用戶信息
      const tokenModel: ITokenModel = {
        token: idToken,
        name: user.displayName || user.email?.split('@')[0] || 'Firebase User',
        email: user.email || '',
        id: user.uid,
        avatar: user.photoURL || '',
        time: +new Date(),
        expired: +new Date() + 1000 * 60 * 60, // 1小時後過期
        // Firebase 特有信息
        firebase: {
          uid: user.uid,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          providerId: user.providerId,
          providerData: user.providerData
        }
      };

      // 清空路由復用信息
      this.reuseTabService?.clear();

      // 設置用戶信息到 @delon/theme settings
      this.settingsService.setUser({
        ...this.settingsService.user,
        ...tokenModel
      });

      // 設置 token 到 @delon/auth
      this.tokenService.set(tokenModel);

      // 調用 @delon/auth 的 social service callback（如果可用）
      if (this.socialService) {
        this.socialService.callback(tokenModel);
      }

      // 重新獲取 StartupService 內容
      this.startupService.load().subscribe(() => {
        let url = this.tokenService.referrer!.url || '/';
        if (url.includes('/passport')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });

      this.message.success('登入成功');
    } catch (error) {
      console.error('處理認證成功流程失敗:', error);
      this.message.error('登入處理失敗，請稍後再試');
      throw error;
    }
  }

  /**
   * 獲取當前 Firebase 用戶
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * 檢查用戶是否已登入
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  /**
   * 獲取當前用戶的 ID Token
   */
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}
