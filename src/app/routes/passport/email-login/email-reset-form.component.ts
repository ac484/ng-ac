/**
 * 郵箱密碼重置表單元件
 *
 * 使用 FirebaseAuthService 提供密碼重設功能
 * 整合 @delon/auth 認證系統，確保與既有流程無縫銜接
 */

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

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
        <button nz-button type="submit" nzType="primary" nzSize="large" [nzLoading]="loading" nzBlock> 
          發送重置郵件 
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
export class EmailResetFormComponent {
  private readonly message = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly firebaseAuthService = inject(FirebaseAuthService);

  @Output() resetSuccess = new EventEmitter<void>();

  loading = false;

  resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    this.loading = true;
    const { email } = this.resetForm.value;

    this.firebaseAuthService.sendPasswordResetEmail(email!).subscribe({
      next: (result) => {
        if (result.success) {
          this.message.success(result.message || '密碼重設郵件已發送，請檢查您的郵箱');
          this.resetSuccess.emit();
          this.resetForm.reset();
        }
      },
      error: (error) => {
        this.message.error(error.message || '發送失敗，請稍後再試');
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
