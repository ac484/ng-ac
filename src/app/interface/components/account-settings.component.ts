/**
 * Account Settings Component
 * Personal settings page for user account configuration
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSwitchModule,
    NzSelectModule,
    NzDividerModule,
    NzTabsModule
  ],
  template: `
    <div class="account-settings-container">
      <nz-card nzTitle="個人設置">
        <nz-tabs>
          <!-- 基本資料 -->
          <nz-tab nzTitle="基本資料">
            <form nz-form [formGroup]="basicForm" (ngSubmit)="onBasicSubmit()">
              <nz-form-item>
                <nz-form-label [nzSpan]="4" nzRequired>用戶名稱</nz-form-label>
                <nz-form-control [nzSpan]="16" nzErrorTip="請輸入用戶名稱">
                  <input nz-input formControlName="username" placeholder="請輸入用戶名稱" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4" nzRequired>電子郵件</nz-form-label>
                <nz-form-control [nzSpan]="16" nzErrorTip="請輸入有效的電子郵件">
                  <input nz-input formControlName="email" placeholder="請輸入電子郵件" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4">手機號碼</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <input nz-input formControlName="phone" placeholder="請輸入手機號碼" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4">時區</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <nz-select formControlName="timezone" placeholder="請選擇時區">
                    <nz-option nzValue="Asia/Taipei" nzLabel="台北 (UTC+8)"></nz-option>
                    <nz-option nzValue="Asia/Hong_Kong" nzLabel="香港 (UTC+8)"></nz-option>
                    <nz-option nzValue="Asia/Shanghai" nzLabel="上海 (UTC+8)"></nz-option>
                    <nz-option nzValue="UTC" nzLabel="UTC"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-control [nzSpan]="16" [nzOffset]="4">
                  <button nz-button nzType="primary" [disabled]="!basicForm.valid">
                    <span nz-icon nzType="save"></span>
                    保存基本資料
                  </button>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-tab>

          <!-- 安全設置 -->
          <nz-tab nzTitle="安全設置">
            <form nz-form [formGroup]="securityForm" (ngSubmit)="onSecuritySubmit()">
              <nz-form-item>
                <nz-form-label [nzSpan]="4" nzRequired>當前密碼</nz-form-label>
                <nz-form-control [nzSpan]="16" nzErrorTip="請輸入當前密碼">
                  <input nz-input type="password" formControlName="currentPassword" placeholder="請輸入當前密碼" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4" nzRequired>新密碼</nz-form-label>
                <nz-form-control [nzSpan]="16" nzErrorTip="密碼長度至少6位">
                  <input nz-input type="password" formControlName="newPassword" placeholder="請輸入新密碼" />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4" nzRequired>確認新密碼</nz-form-label>
                <nz-form-control [nzSpan]="16" nzErrorTip="兩次輸入的密碼不一致">
                  <input nz-input type="password" formControlName="confirmPassword" placeholder="請再次輸入新密碼" />
                </nz-form-control>
              </nz-form-item>

              <nz-divider></nz-divider>

              <nz-form-item>
                <nz-form-label [nzSpan]="4">兩步驗證</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <nz-switch formControlName="twoFactorAuth"></nz-switch>
                  <span style="margin-left: 8px;">啟用兩步驗證以提高帳戶安全性</span>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-control [nzSpan]="16" [nzOffset]="4">
                  <button nz-button nzType="primary" [disabled]="!securityForm.valid">
                    <span nz-icon nzType="safety"></span>
                    更新安全設置
                  </button>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-tab>

          <!-- 通知設置 -->
          <nz-tab nzTitle="通知設置">
            <form nz-form [formGroup]="notificationForm" (ngSubmit)="onNotificationSubmit()">
              <nz-form-item>
                <nz-form-label [nzSpan]="4">電子郵件通知</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <nz-switch formControlName="emailNotification"></nz-switch>
                  <span style="margin-left: 8px;">接收重要通知的電子郵件</span>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4">系統通知</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <nz-switch formControlName="systemNotification"></nz-switch>
                  <span style="margin-left: 8px;">接收系統更新和維護通知</span>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label [nzSpan]="4">營銷通知</nz-form-label>
                <nz-form-control [nzSpan]="16">
                  <nz-switch formControlName="marketingNotification"></nz-switch>
                  <span style="margin-left: 8px;">接收產品更新和優惠信息</span>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-control [nzSpan]="16" [nzOffset]="4">
                  <button nz-button nzType="primary">
                    <span nz-icon nzType="notification"></span>
                    保存通知設置
                  </button>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-tab>
        </nz-tabs>
      </nz-card>
    </div>
  `,
  styles: [`
    .account-settings-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    nz-form-item {
      margin-bottom: 16px;
    }

    nz-divider {
      margin: 24px 0;
    }
  `]
})
export class AccountSettingsComponent implements OnInit {
  basicForm!: FormGroup;
  securityForm!: FormGroup;
  notificationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    // 基本資料表單
    this.basicForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      timezone: ['Asia/Taipei']
    });

    // 安全設置表單
    this.securityForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      twoFactorAuth: [false]
    }, { validators: this.passwordMatchValidator });

    // 通知設置表單
    this.notificationForm = this.fb.group({
      emailNotification: [true],
      systemNotification: [true],
      marketingNotification: [false]
    });
  }

  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onBasicSubmit(): void {
    if (this.basicForm.valid) {
      this.message.success('基本資料已保存');
      console.log('Basic form submitted:', this.basicForm.value);
    }
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.message.success('安全設置已更新');
      console.log('Security form submitted:', this.securityForm.value);
    }
  }

  onNotificationSubmit(): void {
    this.message.success('通知設置已保存');
    console.log('Notification form submitted:', this.notificationForm.value);
  }
} 