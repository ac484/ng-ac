/**
 * Google 登入元件
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供 Google 登入功能，整合 ng-alain 認證系統
 */

import { Component, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzToolTipModule],
  template: `
    <i
      nz-tooltip
      nzTooltipTitle="Google 登入"
      (click)="loginWithGoogle()"
      nz-icon
      nzType="google"
      class="icon"
      [class.loading]="loading"
    ></i>
  `,
  styles: [
    `
      .icon {
        font-size: 24px;
        color: #666;
        cursor: pointer;
        transition: color 0.3s;
      }

      .icon:hover {
        color: #1890ff;
      }

      .icon.loading {
        color: #d9d9d9;
        cursor: not-allowed;
      }
    `
  ]
})
export class GoogleAuthComponent {
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(Auth);

  loading = false;

  async loginWithGoogle(): Promise<void> {
    this.loading = true;

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);

      // 登入成功後跳轉到 Firebase callback 路由，讓 callback 統一處理
      this.router.navigateByUrl('/passport/callback/firebase');
    } catch (error) {
      console.error('Google 登入失敗:', error);
      this.message.error('Google 登入失敗，請稍後再試');
    } finally {
      this.loading = false;
    }
  }
}
