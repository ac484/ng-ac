/**
 * 郵箱註冊表單元件
 *
 * 使用 FirebaseAuthService 提供郵箱註冊功能
 * 整合 @delon/auth 認證系統，確保與既有流程無縫銜接
 */

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

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
        <nz-form-control nzErrorTip="請輸入顯示名稱">
          <nz-input-group nzSize="large" nzPrefixIcon="user">
            <input nz-input formControlName="displayName" placeholder="顯示名稱（可選）" />
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
        <button nz-button type="submit" nzType="primary" nzSize="large" [nzLoading]="loading" nzBlock> 
          註冊 
        </button>
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
  private readonly fb = inject(FormBuilder);
  private readonly firebaseAuthService = inject(FirebaseAuthService);

  @Output() registerSuccess = new EventEmitter<void>();

  loading = false;

  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      displayName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    const { email, password, displayName } = this.registerForm.value;

    this.firebaseAuthService.createUserWithEmail({
      email: email!,
      password: password!,
      displayName: displayName || undefined
    }).subscribe({
      next: async (result) => {
        if (result.success && result.user) {
          this.message.success('註冊成功！正在為您登入...');
          this.registerSuccess.emit();
          // 註冊成功後自動登入
          await this.firebaseAuthService.handleAuthSuccess(result.user);
        }
      },
      error: (error) => {
        this.message.error(error.message || '註冊失敗，請稍後再試');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: AbstractControl): void {
    Object.keys(formGroup.value).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormBuilder) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }
}
