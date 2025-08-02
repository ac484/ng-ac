/**
 * 郵箱註冊表單元件
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供郵箱註冊功能
 */

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { createUserWithEmailAndPassword, sendEmailVerification, Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-email-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  template: `
    <form nz-form [formGroup]="registerForm" (ngSubmit)="register()">
      <nz-form-item>
        <nz-form-control nzErrorTip="請輸入有效的郵箱地址">
          <nz-input-group nzSize="large" nzPrefixIcon="mail">
            <input nz-input formControlName="email" placeholder="郵箱地址" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control nzErrorTip="密碼至少6位">
          <nz-input-group nzSize="large" nzPrefixIcon="lock">
            <input nz-input type="password" formControlName="password" placeholder="密碼" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control nzErrorTip="請確認密碼">
          <nz-input-group nzSize="large" nzPrefixIcon="lock">
            <input nz-input type="password" formControlName="confirmPassword" placeholder="確認密碼" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <button nz-button type="submit" nzType="primary" nzSize="large" [nzLoading]="loading" nzBlock> 註冊 </button>
      </nz-form-item>
    </form>
  `,
  styles: [
    `
      nz-form-item {
        margin-bottom: 16px;
      }
    `
  ]
})
export class EmailRegisterFormComponent {
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(Auth);
  private readonly fb = inject(FormBuilder);

  @Output() registerSuccess = new EventEmitter<void>();

  loading = false;

  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(group: any): Record<string, any> | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value;

    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email!, password!);
      const user = credential.user;

      // 發送郵箱驗證
      await sendEmailVerification(user);

      // 註冊成功，觸發事件讓父元件處理
      this.message.success('郵箱註冊成功！請檢查郵箱進行驗證。');
      this.registerSuccess.emit();
    } catch (error: any) {
      console.error('註冊失敗:', error);
      this.message.error(this.getErrorMessage(error.code));
    } finally {
      this.loading = false;
    }
  }

  private markFormGroupTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '郵箱已被使用';
      case 'auth/weak-password':
        return '密碼強度太弱';
      case 'auth/invalid-email':
        return '郵箱格式無效';
      case 'auth/too-many-requests':
        return '請求過於頻繁，請稍後再試';
      default:
        return '註冊失敗，請稍後再試';
    }
  }
}
