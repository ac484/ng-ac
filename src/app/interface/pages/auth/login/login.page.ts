/**
 * @fileoverview 登錄頁面組件 (Login Page Component)
 * @description 使用Angular Material實現的用戶登錄頁面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Auth Page
 * - 職責：用戶登錄頁面，使用Material Design
 * - 依賴：認證服務, 表單, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現登錄功能
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用form field、input和button組件
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
  selector: 'app-login-page',
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
    <div class="login-form">
      <h2>用戶登錄</h2>

      <form (ngSubmit)="onLogin()" #loginForm="ngForm">
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
            placeholder="請輸入密碼"
          >
          <mat-icon matSuffix>lock</mat-icon>
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!loginForm.valid || isLoading"
          class="full-width">
          <mat-icon *ngIf="isLoading">hourglass_empty</mat-icon>
          {{ isLoading ? '登錄中...' : '登錄' }}
        </button>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="register-link">
          <button
            mat-button
            type="button"
            (click)="goToRegister()"
            color="accent">
            沒有帳號？點此註冊
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-form {
      width: 100%;
    }

    .login-form h2 {
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

    .register-link {
      text-align: center;
      margin-top: 20px;
    }
  `]
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = '請輸入郵箱和密碼';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        // 登錄成功，跳轉到儀表板
        this.router.navigate(['/app/blank']);
      } else {
        this.errorMessage = '登錄失敗，請檢查郵箱和密碼';
      }
    } catch (error) {
      this.errorMessage = '登錄時發生錯誤';
      console.error('登錄錯誤:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
