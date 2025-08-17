/**
 * @fileoverview App Shell 演示頁面，展示 App Shell 功能和現代化佈局組件
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page
 * • 依賴：AppShellService, OfflineService, LayoutGridComponent, AppShellModernComponent
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責演示頁面的渲染和交互
 * • 不包含具體的業務邏輯
 *
 * @module AppShellDemoPage
 * @layer Interface
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

import { Component, inject } from '@angular/core';
import { AppShellService, OfflineService } from '../../../application/services/app-shell';
import { LayoutGridComponent } from '../../components/layout/layout-grid';
import { AppShellModernComponent } from '../../components/layout/app-shell-modern';

@Component({
  selector: 'app-shell-demo',
  standalone: true,
  imports: [LayoutGridComponent, AppShellModernComponent],
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
        <h2>現代化佈局組件</h2>
        
        <h3>Layout Grid 組件</h3>
        <app-layout-grid [columns]="2" [gap]="'1rem'" [padding]="'1rem'">
          <div class="grid-item">項目 1</div>
          <div class="grid-item">項目 2</div>
        </app-layout-grid>

        <h3>App Shell Modern 組件</h3>
        <app-shell-modern>
          <div shell-sidenav>
            <h4>側邊欄內容</h4>
            <ul>
              <li>導航項目 1</li>
              <li>導航項目 2</li>
              <li>導航項目 3</li>
            </ul>
          </div>
          <div class="main-content">
            <h4>主要內容區域</h4>
            <p>這是使用現代化 App Shell 組件的主要內容區域。</p>
          </div>
        </app-shell-modern>
      </div>

      <div class="demo-section">
        <h2>PWA 功能</h2>
        <p>Service Worker: {{ hasServiceWorker ? '支援' : '不支援' }}</p>
        <p>推送通知: {{ hasPushNotification ? '支援' : '不支援' }}</p>
        @if (canInstallPWA) {
          <button (click)="installPWA()">安裝 PWA</button>
        }
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

    .grid-item {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
      text-align: center;
    }

    .main-content {
      padding: 1rem;
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
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.canInstallPWA = true;
    }
  }

  installPWA(): void {
    // PWA 安裝邏輯
    console.log('PWA 安裝功能待實現');
  }
}
