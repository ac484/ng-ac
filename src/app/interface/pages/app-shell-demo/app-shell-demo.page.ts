/**
 * App Shell 演示頁面
 * 展示 App Shell 功能和特性
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { Component, inject } from '@angular/core';
import { AppShellService, OfflineService } from '../../../application/services/app-shell';

@Component({
  selector: 'app-shell-demo',
  standalone: true,
  template: `
    <div class="demo-page">
      <h1>App Shell 演示</h1>

      <div class="demo-section">
        <h2>狀態監控</h2>
        <p>初始化狀態: {{ appShellService.isInitialized() ? '已初始化' : '未初始化' }}</p>
        <p>網路狀態: {{ offlineService.isOnline() ? '在線' : '離線' }}</p>
        <p>當前主題: {{ appShellService.currentTheme() }}</p>
        <p>側邊欄狀態: {{ appShellService.sidebarOpen() ? '開啟' : '關閉' }}</p>
      </div>

      <div class="demo-section">
        <h2>功能測試</h2>
        <button (click)="testTheme()">切換主題</button>
        <button (click)="testSidebar()">切換側邊欄</button>
        <button (click)="testOffline()">模擬離線</button>
      </div>

      <div class="demo-section">
        <h2>PWA 功能</h2>
        <p>Service Worker: {{ hasServiceWorker ? '支援' : '不支援' }}</p>
        <p>推送通知: {{ hasPushNotification ? '支援' : '不支援' }}</p>
        <button (click)="installPWA()" *ngIf="canInstallPWA">安裝 PWA</button>
      </div>
    </div>
  `,
  styles: [`
    .demo-page {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      margin: 2rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #1565c0;
    }
  `]
})
export class AppShellDemoPage {
  protected readonly appShellService = inject(AppShellService);
  protected readonly offlineService = inject(OfflineService);

  hasServiceWorker = 'serviceWorker' in navigator;
  hasPushNotification = 'Notification' in window;
  canInstallPWA = false;

  constructor() {
    this.checkPWAInstallation();
  }

  testTheme(): void {
    this.appShellService.toggleTheme();
  }

  testSidebar(): void {
    this.appShellService.toggleSidebar();
  }

  testOffline(): void {
    // 模擬離線狀態
    this.offlineService.setOnlineStatus(false);
  }

  private checkPWAInstallation(): void {
    // 檢查是否可以安裝 PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      this.canInstallPWA = true;
    });
  }

  installPWA(): void {
    // 觸發 PWA 安裝
    console.log('PWA 安裝功能');
  }
}
