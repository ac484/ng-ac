/**
 * @fileoverview Main App 佈局容器 (MainApp Layout Component)
 * @description 登入後主容器：整合 App Shell、Header、Sidebar、MainContent、Footer、TabNavigation
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Layout Component
 * • 依賴：Angular Core, Router, AppShellModernComponent, HeaderComponent, FooterComponent, TabNavigationComponent
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅負責佈局組裝與委派，不包含業務邏輯
 *
 * @module Layout
 * @layer Interface
 * @context Main Application Layout
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { TabNavigationComponent } from '../../components/common/tab-navigation';
import { AppShellModernComponent } from '../../components/layout/app-shell-modern';
import { FooterComponent } from '../../components/layout/footer';
import { HeaderComponent } from '../../components/layout/header';

@Component({
  selector: 'app-main-app-layout',
  standalone: true,
  imports: [AppShellModernComponent, HeaderComponent, FooterComponent, TabNavigationComponent, RouterOutlet, RouterLink],
  template: `
    <app-shell-modern>
      <div shell-sidenav style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <a routerLink="/app/dashboard">儀表板</a>
        <a routerLink="/app/users">用戶管理</a>
        <a routerLink="/app/tab-demo">Tab Demo</a>
      </div>

      <div style="display: flex; flex-direction: column; height: 100vh;">
        <app-header />
        <app-tab-navigation />
        <div style="flex: 1; overflow: auto; padding: 16px;">
          <router-outlet />
        </div>
        <app-footer />
      </div>
    </app-shell-modern>
  `,
  styles: [`:host{display:block;height:100vh;width:100vw;}`]
})
export class MainAppLayoutComponent {}


