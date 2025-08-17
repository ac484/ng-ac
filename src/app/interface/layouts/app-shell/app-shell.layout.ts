/**
 * @fileoverview App Shell 佈局容器 (AppShell Layout Component)
 * @description 已登入主容器：極簡薄殼，委派 Sidebar 組件承載內容與路由
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Layout Component
 * • 依賴：Angular Core, Router, SidebarComponent
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅負責佈局組裝與委派，不包含業務邏輯
 */

import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/layout/sidebar';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <!-- 極簡委派：由 SidebarComponent 承載 sidenav 與 router-outlet -->
    <app-sidebar />
  `,
  styles: [`:host{display:block;height:100vh;width:100vw;}`]
})
export class AppShellLayoutComponent {}


