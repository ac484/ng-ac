/**
 * 郵箱登入表單元件
 *
 * 使用 FirebaseAuthService 提供郵箱登入功能
 * 整合 @delon/auth 認證系統，確保與既有流程無縫銜接
 */

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseAuthService } from '../../../infrastructure/services/firebase-auth.service';

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
          <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="loginForm.invalid"> 
            登入 
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class EmailLoginFormComponent {
  private readonly message = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly firebaseAuthService = inject(FirebaseAuthService);

  loading = false;
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.firebaseAuthService.signInWithEmail({ 
      email: email!, 
      password: password! 
    }).subscribe({
      next: async (result) => {
        if (result.success && result.user) {
          await this.firebaseAuthService.handleAuthSuccess(result.user);
        }
      },
      error: (error) => {
        this.message.error(error.message || '登入失敗，請稍後再試');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 