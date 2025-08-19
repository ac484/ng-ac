/**
 * @fileoverview 用戶表單組件 (User Form Component)
 * @description 使用Angular Material實現的超極簡用戶表單組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Form Component
 * - 職責：超極簡用戶表單組件，只保留最基本功能
 * - 依賴：Angular Core, Angular Material, Reactive Forms
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現用戶表單
 * - 採用超極簡主義設計，只保留最基本功能
 * - 不添加過度複雜的邏輯
 */

import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 400px; margin: 16px;">
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px;">
        <mat-label>姓名</mat-label>
        <input matInput formControlName="name" placeholder="請輸入姓名">
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px;">
        <mat-label>郵箱</mat-label>
        <input matInput formControlName="email" type="email" placeholder="請輸入郵箱">
      </mat-form-field>
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px;">
        <mat-label>角色</mat-label>
        <mat-select formControlName="role">
          <mat-option value="user">用戶</mat-option>
          <mat-option value="admin">管理員</mat-option>
        </mat-select>
      </mat-form-field>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button mat-button type="button" (click)="onCancel()">取消</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">提交</button>
      </div>
    </form>
  `,
  styles: [``]
})
export class UserFormComponent {
  @Input() user: any = {};
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  onSubmit(): void { console.log('表單提交:', this.form.value); }
  onCancel(): void { console.log('取消操作'); }
}
