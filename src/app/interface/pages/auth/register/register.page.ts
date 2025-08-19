/**
 * @fileoverview 註冊頁面組件 (Register Page Component)
 * @description 使用Angular Material實現的用戶註冊頁面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Auth Page
 * - 職責：用戶註冊頁面，使用Material Design
 * - 依賴：認證服務, 表單, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現註冊功能
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用form field、input和button組件
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../../../security/authentication/services';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="register-form">
      <h2>用戶註冊</h2>

      <form (ngSubmit)="onRegister()" #registerForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>郵箱</mat-label>
          <input
            matInput
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="請輸入郵箱"
          >
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>密碼</mat-label>
          <input
            matInput
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            minlength="6"
            placeholder="請輸入密碼 (至少6位)"
          >
          <mat-icon matSuffix>lock</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>確認密碼</mat-label>
          <input
            matInput
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            required
            placeholder="請再次輸入密碼"
          >
          <mat-icon matSuffix>lock_outline</mat-icon>
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!registerForm.valid || isLoading || !passwordsMatch()"
          class="full-width">
          <mat-icon *ngIf="isLoading">hourglass_empty</mat-icon>
          {{ isLoading ? '註冊中...' : '註冊' }}
        </button>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div class="login-link">
          <button
            mat-button
            type="button"
            (click)="goToLogin()"
            color="accent">
            已有帳號？點此登入
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-form {
      width: 100%;
    }

    .register-form h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin: 20px 0;
      font-size: 14px;
    }

    .success-message {
      color: #4caf50;
      text-align: center;
      margin: 20px 0;
      font-size: 14px;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
    }
  `]
})
export class RegisterPageComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  async onRegister(): Promise<void> {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = '請填寫所有欄位';
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = '兩次輸入的密碼不一致';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = '密碼長度至少6位';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = await this.authService.register(this.email, this.password);

      if (user) {
        this.successMessage = '註冊成功！正在跳轉到登錄頁面...';

        // 延遲跳轉到登錄頁面
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        this.errorMessage = '註冊失敗，請稍後重試';
      }

    } catch (error) {
      this.errorMessage = '註冊時發生錯誤';
      console.error('註冊錯誤:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
