/**
 * 匿名登入元件
 *
 * 使用 FirebaseAuthService 提供匿名登入功能
 * 整合 @delon/auth 認證系統，確保與既有流程無縫銜接
 */

import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-anonymous-login',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzToolTipModule],
  template: `
    <i 
      nz-tooltip 
      nzTooltipTitle="匿名登入" 
      (click)="loginAnonymously()" 
      nz-icon 
      nzType="user" 
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
export class AnonymousLoginComponent {
  private readonly message = inject(NzMessageService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);

  loading = false;

  loginAnonymously(): void {
    if (this.loading) return;
    
    this.loading = true;

    this.firebaseAuthService.signInAnonymously().subscribe({
      next: async (result) => {
        if (result.success && result.user) {
          await this.firebaseAuthService.handleAuthSuccess(result.user);
        }
      },
      error: (error) => {
        this.message.error(error.message || '匿名登入失敗，請稍後再試');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
