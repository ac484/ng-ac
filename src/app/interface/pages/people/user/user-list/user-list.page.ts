/**
 * @fileoverview 用戶列表頁面組件 (User List Page Component)
 * @description 使用Angular Material實現的用戶列表頁面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer User Page
 * - 職責：用戶列表頁面展示，使用Material Design
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現用戶列表
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用table組件展示用戶數據
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="user-list">
      <h1>用戶管理</h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>用戶列表</mat-card-title>
          <mat-card-subtitle>系統中的所有用戶</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="users" class="user-table">
            <!-- 用戶ID列 -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let user">{{user.id}}</td>
            </ng-container>

            <!-- 用戶名列 -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>用戶名</th>
              <td mat-cell *matCellDef="let user">{{user.name}}</td>
            </ng-container>

            <!-- 郵箱列 -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>郵箱</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>

            <!-- 狀態列 -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>狀態</th>
              <td mat-cell *matCellDef="let user">{{user.status}}</td>
            </ng-container>

            <!-- 操作列 -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>操作</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="primary" (click)="editUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list {
      padding: 20px;
    }

    .user-list h1 {
      margin-bottom: 30px;
      color: #333;
    }

    .user-table {
      width: 100%;
    }

    .user-table th {
      font-weight: 600;
      color: #333;
    }

    .user-table td {
      padding: 12px 8px;
    }
  `]
})
export class UserListPageComponent {
  users = [
    { id: 1, name: '張三', email: 'zhangsan@example.com', status: '活躍' },
    { id: 2, name: '李四', email: 'lisi@example.com', status: '活躍' },
    { id: 3, name: '王五', email: 'wangwu@example.com', status: '停用' }
  ];

  displayedColumns = ['id', 'name', 'email', 'status', 'actions'];

  editUser(user: any): void {
    console.log('編輯用戶:', user);
  }

  deleteUser(user: any): void {
    console.log('刪除用戶:', user);
  }
}
