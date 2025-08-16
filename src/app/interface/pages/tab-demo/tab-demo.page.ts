/**
 * @fileoverview Tab 演示頁面檔案 (Tab Demo Page)
 * @description 展示 Tab Navigation 系統的功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Tab Demo Page
 * - 職責：Tab 功能演示頁面
 * - 依賴：Tab Navigation Service
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案用於演示 Tab Navigation 功能
 * - 遵循極簡主義原則，只實現必要的功能
 * - 使用官方 Angular Material 組件
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TabNavigationService } from '../../../application/services/tab-navigation/tab-navigation.service';
import { TAB_ICONS } from '../../../shared/constants/tab/tab.constants';

@Component({
  selector: 'app-tab-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="tab-demo-container">
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>Tab Navigation 演示</mat-card-title>
          <mat-card-subtitle>點擊按鈕新增標籤頁</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="button-group">
            <button
              mat-raised-button
              color="primary"
              (click)="addDashboardTab()">
              <mat-icon>{{ TAB_ICONS.DASHBOARD }}</mat-icon>
              新增儀表板標籤
            </button>

            <button
              mat-raised-button
              color="accent"
              (click)="addUserTab()">
              <mat-icon>{{ TAB_ICONS.USER }}</mat-icon>
              新增用戶標籤
            </button>

            <button
              mat-raised-button
              color="warn"
              (click)="addSettingsTab()">
              <mat-icon>{{ TAB_ICONS.SETTINGS }}</mat-icon>
              新增設置標籤
            </button>
          </div>

          <div class="info-section">
            <p>當前標籤頁數量: {{ tabService.tabs().length }}</p>
            <p>活動標籤頁: {{ tabService.activeTab()?.label || '無' }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./tab-demo.page.scss']
})
export class TabDemoPage {
  // 將 tabService 改為 public 以便在模板中訪問
  public tabService = inject(TabNavigationService);

  readonly TAB_ICONS = TAB_ICONS;

  addDashboardTab(): void {
    this.tabService.addTab({
      label: '儀表板',
      route: '/app/dashboard',
      icon: TAB_ICONS.DASHBOARD,
      closable: true
    });
  }

  addUserTab(): void {
    this.tabService.addTab({
      label: '用戶管理',
      route: '/app/users',
      icon: TAB_ICONS.USER,
      closable: true
    });
  }

  addSettingsTab(): void {
    this.tabService.addTab({
      label: '系統設置',
      route: '/app/settings',
      icon: TAB_ICONS.SETTINGS,
      closable: true
    });
  }
}
