/**
 * @fileoverview 儀表板佈局組件 (Dashboard Layout Component)
 * @description 使用Angular Material實現的儀表板頁面佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Dashboard Layout
 * - 職責：儀表板頁面佈局管理，使用Material Design
 * - 依賴：Angular Core, Router, Angular Material, Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現儀表板佈局
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用卡片和網格佈局，適合數據展示
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="dashboard-layout">
      <!-- 頂部工具欄 -->
      <mat-toolbar color="primary" class="dashboard-toolbar">
        <span>儀表板</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button>
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </button>
      </mat-toolbar>

      <!-- 儀表板內容 -->
      <div class="dashboard-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .dashboard-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }
  `]
})
export class DashboardLayoutComponent {}
