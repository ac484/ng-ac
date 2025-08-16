/**
 * App Shell 主組件
 * 實現應用骨架預載入和響應式佈局
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellService, OfflineService } from '../../../../application/services/app-shell';

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
              ☰
            </button>
          </div>
        </nav>
      </header>

      <!-- 應用側邊欄 -->
      <aside class="app-sidebar" [class.sidebar-open]="sidebarOpen()">
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul>
              <li><a href="/dashboard" routerLink="/dashboard">儀表板</a></li>
              <li><a href="/users" routerLink="/users">用戶管理</a></li>
              <li><a href="/settings" routerLink="/settings">設定</a></li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- 應用主內容 -->
      <main class="app-main" id="main-content">
        <div class="main-content">
          <router-outlet />
        </div>
      </main>

      <!-- 應用頁腳 -->
      <footer class="app-footer">
        <p>&copy; 2024 NG-AC Enterprise. All rights reserved.</p>
        <p>網路狀態: {{ isOnline() ? '在線' : '離線' }}</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppShellComponent {
  private readonly appShellService = inject(AppShellService);
  private readonly offlineService = inject(OfflineService);

  // 響應式狀態
  readonly sidebarOpen = this.appShellService.sidebarOpen;
  readonly currentTheme = this.appShellService.currentTheme;
  readonly isOnline = this.offlineService.isOnline;

  // 計算屬性
  readonly themeClass = computed(() => `theme-${this.currentTheme()}`);

  toggleTheme(): void {
    this.appShellService.toggleTheme();
  }

  toggleSidebar(): void {
    this.appShellService.toggleSidebar();
  }
}
