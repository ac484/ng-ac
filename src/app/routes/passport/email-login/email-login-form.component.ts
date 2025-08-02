/**
 * 郵箱登入表單元件
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供郵箱登入功能，整合 ng-alain 認證系統
 */

import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-email-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  template: `
    <form nz-form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>郵箱</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="請輸入有效的郵箱地址">
          <input nz-input formControlName="email" placeholder="請輸入郵箱地址" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>密碼</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="請輸入密碼">
          <input nz-input type="password" formControlName="password" placeholder="請輸入密碼" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzOffset]="6" [nzSpan]="18">
          <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="loginForm.invalid"> 登入 </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class EmailLoginFormComponent {
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(Auth);
  private readonly fb = inject(FormBuilder);

  loading = false;
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email!, password!);

      // 登入成功後跳轉到 Firebase callback 路由，讓 callback 統一處理
      this.router.navigateByUrl('/passport/callback/firebase');
    } catch (error: any) {
      console.error('郵箱登入失敗:', error);
      let errorMessage = '登入失敗，請稍後再試';

      if (error.code === 'auth/user-not-found') {
        errorMessage = '用戶不存在';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = '密碼錯誤';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '郵箱格式無效';
      }

      this.message.error(errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
