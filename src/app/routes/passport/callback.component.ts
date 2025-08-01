/**
 * 認證回調組件
 * 
 * 完整流程的最後一步：處理所有認證成功後的統一邏輯
 * Firebase認證 → FirebaseAuthService → 這裡統一處理 → 跳轉到主頁
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div style="text-align: center; padding: 50px;">
      @if (type === 'firebase') {
        <div>
          <div>🔄</div>
          <p style="margin-top: 16px;">正在處理 Firebase 登入...</p>
        </div>
      } @else {
        <div>
          <div>🔄</div>
          <p style="margin-top: 16px;">正在處理登入...</p>
        </div>
      }
    </div>
  `,
  providers: [SocialService],
  standalone: true,
  imports: [
    // ng-zorro 組件
    // NzSpinModule 需要在這裡導入，但為了簡化，我們先用基本的 div
  ]
})
export class CallbackComponent implements OnInit {
  private readonly socialService = inject(SocialService);
  private readonly settingsSrv = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  
  @Input() type = '';

  ngOnInit(): void {
    console.log('CallbackComponent 初始化，type:', this.type);
    
    if (this.type === 'firebase') {
      this.handleFirebaseCallback();
    } else {
      this.mockModel();
    }
  }

  /**
   * 處理 Firebase 認證回調
   * 這是完整流程的核心：將 Firebase 用戶轉換為 @delon/auth 格式
   */
  private async handleFirebaseCallback(): Promise<void> {
    try {
      console.log('開始處理 Firebase 回調...');
      
      const user = this.firebaseAuthService.getCurrentUser();
      if (user) {
        console.log('找到 Firebase 用戶:', user.uid);
        
        // 使用 FirebaseAuthService 統一處理認證成功流程
        await this.firebaseAuthService.handleAuthSuccess(user);
        
        console.log('Firebase 認證處理完成');
      } else {
        console.error('Firebase 認證失敗：沒有用戶信息');
        this.router.navigateByUrl('/passport/login');
      }
    } catch (error) {
      console.error('處理 Firebase 回調失敗:', error);
      this.router.navigateByUrl('/passport/login');
    }
  }

  /**
   * 處理其他第三方登入的模擬回調
   */
  private mockModel(): void {
    const info = {
      token: '123456789',
      name: 'cipchk',
      email: `${this.type}@${this.type}.com`,
      id: 10000,
      time: +new Date()
    };
    this.settingsSrv.setUser({
      ...this.settingsSrv.user,
      ...info
    });
    this.socialService.callback(info);
  }
}
