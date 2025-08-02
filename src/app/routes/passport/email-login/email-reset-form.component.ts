/**
 * 郵箱密碼重置表單元件
 *
 * 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Authentication
 * 提供郵箱密碼重置功能
 */

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { sendPasswordResetEmail, Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-email-reset-form',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  template: `
    <form nz-form [formGroup]="resetForm" (ngSubmit)="resetPassword()">
      <nz-form-item>
        <nz-form-control nzErrorTip="請輸入有效的郵箱地址">
          <nz-input-group nzSize="large" nzPrefixIcon="mail">
            <input nz-input formControlName="email" placeholder="郵箱地址" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <button nz-button type="submit" nzType="primary" nzSize="large" [nzLoading]="loading" nzBlock> 發送重置郵箱 </button>
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
export class EmailResetFormComponent {
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(Auth);
  private readonly fb = inject(FormBuilder);

  @Output() resetSuccess = new EventEmitter<void>();

  loading = false;

  resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  async resetPassword(): Promise<void> {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    this.loading = true;
    const { email } = this.resetForm.value;

    try {
      await sendPasswordResetEmail(this.auth, email!);
      this.message.success('密碼重置郵箱已發送，請檢查郵箱。');
      this.resetSuccess.emit();
    } catch (error: any) {
      console.error('發送重置郵箱失敗:', error);
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
      case 'auth/user-not-found':
        return '用戶不存在';
      case 'auth/invalid-email':
        return '郵箱格式無效';
      case 'auth/too-many-requests':
        return '請求過於頻繁，請稍後再試';
      default:
        return '發送失敗，請稍後再試';
    }
  }
}
