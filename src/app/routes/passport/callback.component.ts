import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

@Component({
  selector: 'app-callback',
  template: ``,
  providers: [SocialService],
  standalone: true
})
export class CallbackComponent implements OnInit {
  private readonly socialService = inject(SocialService);
  private readonly settingsSrv = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  
  @Input() type = '';

  ngOnInit(): void {
    if (this.type === 'firebase') {
      this.handleFirebaseCallback();
    } else {
      this.mockModel();
    }
  }

  private async handleFirebaseCallback(): Promise<void> {
    try {
      const user = this.firebaseAuthService.getCurrentUser();
      if (user) {
        // 使用 FirebaseAuthService 統一處理認證成功流程
        await this.firebaseAuthService.handleAuthSuccess(user);
      } else {
        console.error('Firebase 認證失敗：沒有用戶信息');
        this.router.navigateByUrl('/passport/login');
      }
    } catch (error) {
      console.error('處理 Firebase 回調失敗:', error);
      this.router.navigateByUrl('/passport/login');
    }
  }

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
