import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { firstValueFrom } from 'rxjs';

import { AuthBridgeService } from '../../../application/services/auth-bridge.service';

/**
 * 增強版登入組件
 * 支援多種認證方式：郵箱密碼、Google、管理員帳號
 */
@Component({
  selector: 'app-enhanced-login',
  template: `
    <div class="login-container">
      <div class="login-header">
        <h2>{{ 'login.title' | i18n }}</h2>
        <p>{{ 'login.subtitle' | i18n }}</p>
      </div>

      <!-- 錯誤提示 -->
      <nz-alert *ngIf="error" [nzMessage]="error" nzType="error" nzShowIcon class="mb-3"></nz-alert>

      <!-- 登入表單 -->
      <nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Please enter your email">
            <nz-input-group nzPrefixIcon="user">
              <input nz-input formControlName="email" type="email" placeholder="Email (admin@company.com for admin)" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control nzErrorTip="Please enter your password">
            <nz-input-group nzPrefixIcon="lock">
              <input nz-input formControlName="password" type="password" placeholder="Password (123456 for admin)" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control>
            <label nz-checkbox formControlName="remember">
              {{ 'login.remember' | i18n }}
            </label>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control>
            <button nz-button nzType="primary" nzSize="large" [nzLoading]="loading" [disabled]="form.invalid" class="login-btn">
              {{ 'login.signin' | i18n }}
            </button>
          </nz-form-control>
        </nz-form-item>
      </nz-form>

      <!-- 分隔線 -->
      <nz-divider nzText="OR"></nz-divider>

      <!-- Google 登入 -->
      <button nz-button nzSize="large" [nzLoading]="googleLoading" (click)="signInWithGoogle()" class="google-btn">
        <nz-icon nzType="google" nzTheme="outline"></nz-icon>
        Sign in with Google
      </button>

      <!-- 快速登入提示 -->
      <div class="quick-login-hint">
        <p><strong>Quick Login:</strong></p>
        <p>Admin: admin&#64;company.com / 123456</p>
        <p>Or use your Google account</p>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-header h2 {
        margin-bottom: 0.5rem;
        color: #1890ff;
      }

      .login-header p {
        color: #666;
        margin-bottom: 0;
      }

      .login-btn {
        width: 100%;
      }

      .google-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid #d9d9d9;
        background: white;
        color: #333;
      }

      .google-btn:hover {
        border-color: #1890ff;
        color: #1890ff;
      }

      .quick-login-hint {
        margin-top: 2rem;
        padding: 1rem;
        background: #f6f8fa;
        border-radius: 6px;
        font-size: 0.875rem;
        color: #666;
      }

      .quick-login-hint p {
        margin: 0.25rem 0;
      }

      .quick-login-hint strong {
        color: #333;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    I18nPipe,
    NzCheckboxModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzDividerModule
  ]
})
export class EnhancedLoginComponent {
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authBridge = inject(AuthBridgeService);

  form = inject(FormBuilder).nonNullable.group({
    email: ['admin@company.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
    remember: [true]
  });

  error = '';
  loading = false;
  googleLoading = false;

  /**
   * 郵箱密碼登入
   */
  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.error = '';
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const { email, password } = this.form.value;

      const result = await firstValueFrom(this.authBridge.signInWithEmailPassword(email!, password!));

      if (result.msg === 'ok') {
        await this.handleLoginSuccess();
      } else {
        this.error = result.msg;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.error = error.message || 'Login failed';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Google 登入
   */
  async signInWithGoogle(): Promise<void> {
    this.error = '';
    this.googleLoading = true;
    this.cdr.detectChanges();

    try {
      const result = await firstValueFrom(this.authBridge.signInWithGoogle());

      if (result.msg === 'ok') {
        await this.handleLoginSuccess();
      } else {
        this.error = result.msg;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      this.error = error.message || 'Google login failed';
    } finally {
      this.googleLoading = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * 處理登入成功
   */
  private async handleLoginSuccess(): Promise<void> {
    // 清空路由復用信息
    this.reuseTabService?.clear();

    // 重新獲取 StartupService 內容
    await firstValueFrom(this.startupSrv.load());

    // 導航到主頁
    let url = this.tokenService.referrer!.url || '/';
    if (url.includes('/passport')) {
      url = '/';
    }
    this.router.navigateByUrl(url);
  }
}
