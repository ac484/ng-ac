/**
 * @fileoverview 用戶詳情頁面組件 (User Detail Page Component)
 * @description 使用Angular Material實現的用戶詳情頁面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer User Detail Page
 * - 職責：用戶詳情頁面展示，使用Material Design
 * - 依賴：Angular Core, Angular Material, Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現用戶詳情
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用card組件展示用戶詳細信息
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="user-detail">
      <div class="user-detail-header">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          返回
        </button>
        <h1>用戶詳情</h1>
      </div>

      <mat-card class="user-detail-card">
        <mat-card-header>
          <mat-card-title>{{user.name}}</mat-card-title>
          <mat-card-subtitle>{{user.email}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="user-info">
            <div class="info-row">
              <span class="info-label">用戶ID:</span>
              <span class="info-value">{{user.id}}</span>
            </div>

            <mat-divider></mat-divider>

            <div class="info-row">
              <span class="info-label">角色:</span>
              <mat-chip color="primary">{{user.role}}</mat-chip>
            </div>

            <mat-divider></mat-divider>

            <div class="info-row">
              <span class="info-label">狀態:</span>
              <mat-chip [color]="user.isActive ? 'accent' : 'warn'">
                {{user.isActive ? '活躍' : '非活躍'}}
              </mat-chip>
            </div>

            <mat-divider></mat-divider>

            <div class="info-row">
              <span class="info-label">創建時間:</span>
              <span class="info-value">{{user.createdAt | date:'yyyy-MM-dd HH:mm'}}</span>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="editUser()">
            <mat-icon>edit</mat-icon>
            編輯用戶
          </button>
          <button mat-raised-button color="warn" (click)="deleteUser()">
            <mat-icon>delete</mat-icon>
            刪除用戶
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-detail {
      padding: 20px;
    }

    .user-detail-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .user-detail-header h1 {
      margin: 0 0 0 16px;
      color: #333;
    }

    .user-detail-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .user-info {
      padding: 16px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .info-label {
      font-weight: 500;
      color: #666;
    }

    .info-value {
      color: #333;
    }

    mat-card-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
  `]
})
export class UserDetailPageComponent implements OnInit {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  } = {
    id: '',
    name: '用戶名稱',
    email: 'user@example.com',
    role: '用戶',
    isActive: true,
    createdAt: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 從路由參數獲取用戶ID
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // 這裡應該調用服務獲取用戶詳情
      this.loadUserDetails(userId);
    }
  }

  loadUserDetails(userId: string): void {
    // 模擬加載用戶詳情
    this.user = {
      id: userId,
      name: '示例用戶',
      email: 'user@example.com',
      role: '管理員',
      isActive: true,
      createdAt: new Date('2024-01-01')
    };
  }

  goBack(): void {
    this.router.navigate(['/app/users']);
  }

  editUser(): void {
    this.router.navigate(['/app/users', this.user.id, 'edit']);
  }

  deleteUser(): void {
    // 實現刪除用戶邏輯
    console.log('刪除用戶:', this.user.id);
  }
}
