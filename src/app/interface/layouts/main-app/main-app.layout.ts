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

import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationSyncService } from '../../../application/services/navigation-sync';
import { TabNavigationService } from '../../../application/services/tab-navigation/tab-navigation.service';
import { SIDEBAR_NAV_ITEMS, type SidebarItem } from '../../../shared/constants/sidebar/sidebar.constants';
import { TabNavigationComponent } from '../../components/common/tab-navigation';
import { AppShellModernComponent } from '../../components/layout/app-shell-modern';
import { FooterComponent } from '../../components/layout/footer';
import { HeaderComponent } from '../../components/layout/header';
import { SidebarComponent } from '../../components/layout/sidebar';

@Component({
  selector: 'app-main-app-layout',
  standalone: true,
  imports: [CommonModule, AppShellModernComponent, HeaderComponent, FooterComponent, TabNavigationComponent, SidebarComponent, RouterOutlet],
  template: `
    <app-shell-modern>
      <div shell-sidenav>
        <app-sidebar [navItems]="navItems" />
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
export class MainAppLayoutComponent {
  navItems: SidebarItem[] = SIDEBAR_NAV_ITEMS;
  private readonly tabService = inject(TabNavigationService);
  private readonly navigationSync = inject(NavigationSyncService);

  constructor() {
    // 監聽 Tab 服務的變化，同步到導航服務
    effect(() => {
      const activeTabId = this.tabService.activeTabId();
      const activeTab = this.tabService.activeTab();

      if (activeTab && activeTabId) {
        this.navigationSync.syncNavigation(activeTab.route, activeTabId);
      }
    });
  }
}


