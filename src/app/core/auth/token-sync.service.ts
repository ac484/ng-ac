import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Alain Token 格式介面
 * 基於現有登入組件的 token 格式
 */
export interface AlainFirebaseToken {
  // 標準 Alain token 欄位
  token: string;           // Firebase ID Token
  expired: number;         // Token 過期時間戳
  
  // Firebase 使用者資訊
  uid: string;            // Firebase 使用者 UID
  email?: string;         // 使用者 email
  name?: string;          // 使用者顯示名稱
  avatar?: string;        // 使用者頭像 URL
  
  // 其他可能的欄位
  [key: string]: any;
}

/**
 * Token 同步服務
 * 
 * 負責將 Firebase ID token 轉換為 Alain token 格式
 * 並同步到 ng-alain 的 token 服務和設定服務
 */
@Injectable({
  providedIn: 'root'
})
export class TokenSyncService {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly settingsService = inject(SettingsService);

  /**
   * 同步 Firebase token 到 Alain 系統
   * @param firebaseToken Firebase ID Token
   * @param user Firebase 使用者物件
   */
  syncFirebaseToken(firebaseToken: string, user: User): Observable<void> {
    try {
      const alainToken = this.convertToAlainFormat(firebaseToken, user);
      
      // 設定 Alain token
      this.tokenService.set(alainToken);
      
      // 同步使用者資訊到 SettingsService
      this.settingsService.setUser({
        name: user.displayName || user.email || 'User',
        avatar: user.photoURL || './assets/tmp/img/avatar.jpg',
        email: user.email || '',
        token: firebaseToken
      });

      return of(void 0);
    } catch (error) {
      console.error('Token sync error:', error);
      return of(void 0);
    }
  }

  /**
   * 清除所有 token
   */
  clearTokens(): Observable<void> {
    try {
      this.tokenService.clear();
      // 清除使用者資訊
      this.settingsService.setUser({});
      return of(void 0);
    } catch (error) {
      console.error('Clear tokens error:', error);
      return of(void 0);
    }
  }

  /**
   * 將 Firebase token 轉換為 Alain 格式
   * @param firebaseToken Firebase ID Token
   * @param user Firebase 使用者物件
   */
  convertToAlainFormat(firebaseToken: string, user: User): AlainFirebaseToken {
    // 計算 token 過期時間（Firebase ID token 通常 1 小時過期）
    const expired = Date.now() + (60 * 60 * 1000); // 1 小時後過期

    return {
      token: firebaseToken,
      expired,
      uid: user.uid,
      email: user.email || undefined,
      name: user.displayName || user.email || 'User',
      avatar: user.photoURL || undefined
    };
  }

  /**
   * 監控 token 過期狀態
   * @returns Observable<boolean> true 表示 token 即將過期
   */
  monitorTokenExpiration(): Observable<boolean> {
    return from(this.checkTokenExpiration()).pipe(
      catchError(() => of(true)) // 發生錯誤時假設已過期
    );
  }

  /**
   * 檢查當前 token 是否即將過期
   * @returns Promise<boolean>
   */
  private async checkTokenExpiration(): Promise<boolean> {
    const tokenData = this.tokenService.get();
    if (!tokenData || !tokenData.expired) {
      return true; // 沒有 token 或過期時間，視為過期
    }

    const now = Date.now();
    const expiredTime = tokenData.expired;
    const timeUntilExpiry = expiredTime - now;
    
    // 如果剩餘時間少於 5 分鐘，視為即將過期
    return timeUntilExpiry < (5 * 60 * 1000);
  }

  /**
   * 取得當前 Alain token
   */
  getCurrentToken(): any {
    return this.tokenService.get();
  }
}