import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, User, signOut, onAuthStateChanged, UserCredential, signInAnonymously } from '@angular/fire/auth';
import { SettingsService } from '@delon/theme';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { StartupService } from './startup/startup.service';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface FirebaseUserInfo {
  token: string;
  name: string;
  email: string | null;
  avatar: string | null;
  id: string;
  time: number;
  expired: number;
  firebaseUser: User;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly settingsService = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly startupSrv = inject(StartupService);

  /**
   * 匿名登入 - 最少代碼實現
   */
  async signInAnonymously(): Promise<FirebaseUserInfo> {
    try {
      const result = await signInAnonymously(this.auth);
      const userInfo = await this.convertFirebaseUserToDelonAuth(result.user);
      this.settingsService.setUser(userInfo);
      this.reuseTabService?.clear();
      return userInfo;
    } catch (error: any) {
      console.error('Anonymous Auth Error:', error);
      throw error;
    }
  }

  /**
   * Google 登入 - 最少代碼實現
   */
  async signInWithGoogle(): Promise<FirebaseUserInfo> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const userInfo = await this.convertFirebaseUserToDelonAuth(result.user);
      this.settingsService.setUser(userInfo);
      this.reuseTabService?.clear();
      return userInfo;
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  }

  /**
   * 使用 Firebase Auth 進行社交登入
   */
  async signInWithProvider(provider: 'google' | 'github' | 'microsoft'): Promise<FirebaseUserInfo> {
    let authProvider;
    
    switch (provider) {
      case 'google':
        authProvider = new GoogleAuthProvider();
        break;
      case 'github':
        authProvider = new GithubAuthProvider();
        break;
      case 'microsoft':
        authProvider = new OAuthProvider('microsoft.com');
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    try {
      // 使用彈出窗口進行登入
      const result: UserCredential = await signInWithPopup(this.auth, authProvider);
      
      // 轉換用戶信息
      const userInfo = await this.convertFirebaseUserToDelonAuth(result.user);
      
      // 設置用戶信息到 @delon/auth
      this.settingsService.setUser(userInfo);
      
      // 清空路由复用信息
      this.reuseTabService?.clear();
      
      return userInfo;
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      throw error;
    }
  }

  /**
   * 登出
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      // 清除 @delon/auth 中的用戶信息
      this.settingsService.setUser({});
      this.reuseTabService?.clear();
    } catch (error) {
      console.error('Firebase SignOut Error:', error);
      throw error;
    }
  }

  /**
   * 獲取當前用戶
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
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
   * 檢查用戶是否已登入
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * 獲取用戶的 ID Token
   */
  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * 轉換 Firebase User 為 @delon/auth 格式
   */
  private async convertFirebaseUserToDelonAuth(user: User): Promise<FirebaseUserInfo> {
    const token = await user.getIdToken();
    
    return {
      token,
      name: user.displayName || user.email || 'Anonymous User',
      email: user.email,
      avatar: user.photoURL,
      id: user.uid,
      time: +new Date(),
      expired: +new Date() + 1000 * 60 * 60 * 24 * 7, // 7天過期
      firebaseUser: user
    };
  }

  /**
   * 同步 Firebase 用戶到 @delon/auth
   */
  syncUserToDelonAuth(): Observable<void> {
    return this.onAuthStateChanged().pipe(
      switchMap(user => {
        if (user) {
          return from(this.convertFirebaseUserToDelonAuth(user)).pipe(
            tap(userInfo => {
              this.settingsService.setUser(userInfo);
            }),
            map(() => void 0)
          );
        } else {
          this.settingsService.setUser({});
          return of(void 0);
        }
      })
    );
  }

  /**
   * 初始化認證狀態
   */
  initializeAuth(): Observable<void> {
    return this.syncUserToDelonAuth().pipe(
      switchMap(() => {
        // 重新获取 StartupService 内容
        return this.startupSrv.load();
      })
    );
  }
}
