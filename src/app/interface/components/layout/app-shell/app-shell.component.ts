/**
 * @fileoverview App Shell 主組件 (App Shell Main Component)
 * @description 實現應用骨架預載入和響應式佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Interface Layer App Shell Component
 * - 職責：App Shell 主組件實現
 * - 依賴：App Shell Services, Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 使用 Angular 20+ 的新語法
 * - 整合 App Shell 和 PWA 服務
 * - 支援主題切換和側邊欄控制
 * - 極簡主義實現
 */

import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellService, OfflineService, PwaService } from '../../../../application/services/app-shell';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class]="themeClass()">
      <!-- 跳過導航連結 (無障礙支援) -->
      <a href="#main-content" class="skip-nav sr-only">跳過導航</a>

      <!-- 應用頭部 -->
      <header class="app-header">
        <nav class="app-nav">
          <div class="nav-brand">
            <img src="assets/icons/icon-32x32.png" alt="NG-AC Logo" class="brand-logo">
            <span class="brand-name">NG-AC Enterprise</span>
          </div>

          <div class="nav-actions">
            <button
              (click)="toggleTheme()"
              [attr.aria-label]="'切換到' + (currentTheme() === 'light' ? '暗色' : '亮色') + '主題'"
              class="theme-toggle">
              {{ currentTheme() === 'light' ? '🌙' : '☀️' }}
            </button>

            <button
              (click)="toggleSidebar()"
              aria-label="切換側邊欄"
              class="sidebar-toggle">
              {{ isSidebarOpen() ? '◀' : '▶' }}
            </button>

            <!-- 離線狀態指示器 -->
            <div class="status-indicator" [class]="offlineStatus()">
              {{ isOnline() ? '🟢' : '🔴' }}
            </div>
          </div>
        </nav>
      </header>

      <!-- 側邊欄 -->
      <aside class="app-sidebar" [class]="sidebarClass()">
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul>
              <li><a routerLink="/dashboard">儀表板</a></li>
              <li><a routerLink="/users">用戶管理</a></li>
              <li><a routerLink="/organizations">組織管理</a></li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 主要內容區域 -->
      <main class="app-main" id="main-content">
        <div class="main-content">
          <router-outlet />
        </div>
      </main>

      <!-- 頁腳 -->
      <footer class="app-footer">
        <p>&copy; 2024 NG-AC Enterprise. All rights reserved.</p>
      </footer>

      <!-- PWA 安裝提示 -->
      @if (showInstallPrompt()) {
        <div class="pwa-install-prompt">
          <p>安裝應用程式以獲得更好的體驗</p>
          <button (click)="installPWA()">安裝</button>
          <button (click)="dismissInstallPrompt()">稍後</button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  // 服務注入
  private appShellService = inject(AppShellService);
  private pwaService = inject(PwaService);
  private offlineService = inject(OfflineService);

  // 狀態讀取
  readonly currentTheme = this.appShellService.theme;
  readonly isSidebarOpen = this.appShellService.isSidebarOpen;
  readonly isOnline = this.offlineService.isOnline;
  readonly showInstallPrompt = this.pwaService.showInstallPrompt;

  // 計算屬性
  readonly themeClass = computed(() => `theme-${this.currentTheme()}`);
  readonly sidebarClass = computed(() =>
    this.isSidebarOpen() ? 'sidebar-open' : 'sidebar-closed'
  );
  readonly offlineStatus = computed(() =>
    this.isOnline() ? 'online' : 'offline'
  );

  // 方法
  toggleTheme(): void {
    this.appShellService.toggleTheme();
  }

  toggleSidebar(): void {
    this.appShellService.toggleSidebar();
  }

  async installPWA(): Promise<void> {
    await this.pwaService.installPWA();
  }

  dismissInstallPrompt(): void {
    // 隱藏安裝提示的邏輯
  }
}
