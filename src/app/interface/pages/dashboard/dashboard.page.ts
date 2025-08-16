/**
 * @fileoverview 儀表板頁面組件 (Dashboard Page Component)
 * @description 使用Angular Material實現的儀表板頁面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Dashboard Page
 * - 職責：儀表板頁面展示，使用Material Design
 * - 依賴：Angular Core, Angular Material, Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現儀表板
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用card和button組件展示功能模組
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <h1>歡迎來到 NG-AC Admin</h1>

      <div class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>用戶管理</mat-card-title>
            <mat-card-subtitle>管理系統用戶和權限</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/app/users">
              <mat-icon>people</mat-icon>
              進入
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>系統設置</mat-card-title>
            <mat-card-subtitle>配置系統參數和選項</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button disabled>
              <mat-icon>settings</mat-icon>
              即將推出
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>數據分析</mat-card-title>
            <mat-card-subtitle>查看系統使用統計</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button disabled>
              <mat-icon>analytics</mat-icon>
              即將推出
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }

    .dashboard h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-card {
      text-align: center;
    }

    .dashboard-card mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 16px;
    }

    .dashboard-card button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DashboardPageComponent {}
