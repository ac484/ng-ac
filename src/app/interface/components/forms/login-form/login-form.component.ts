/**
 * @fileoverview 登錄表單組件 (Login Form Component)
 * @description 使用Angular Material實現的超極簡登錄表單組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Form Component
 * - 職責：超極簡登錄表單組件，只保留最基本功能
 * - 依賴：Angular Core, Angular Material, Reactive Forms
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現登錄表單
 * - 採用超極簡主義設計，只保留最基本功能
 * - 不添加過度複雜的邏輯
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 350px; margin: 16px;">
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px;">
        <mat-label>用戶名</mat-label>
        <input matInput formControlName="username" placeholder="請輸入用戶名">
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 24px;">
        <mat-label>密碼</mat-label>
        <input matInput formControlName="password" type="password" placeholder="請輸入密碼">
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" style="width: 100%;" [disabled]="form.invalid">登錄</button>
    </form>
  `,
  styles: [``]
})
export class LoginFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void { console.log('登錄表單提交:', this.form.value); }
}
