/**
 * @fileoverview 侧边栏主组件 (Sidebar Main Component)
 * @description 提供应用的主要侧边栏功能，使用 Angular Material Sidenav 官方 API
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Layout Component
 * - 職責：侧边栏主组件
 * - 依賴：Angular Core, Material Sidenav, Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供基本的侧边栏功能
 * - 使用極簡主義設計，避免過度複雜化
 * - 使用官方 Angular Material Sidenav API
 * - 支援響應式設計和路由導航
 * - 基於官方 API 進行效能優化
 * - 側邊欄預設關閉，用戶可自行控制
 * - 支援狀態緩存，用戶偏好設定持久化
 */

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

import { SIDEBAR_CONFIG, SIDEBAR_NAV_ITEMS } from '../../../../shared/constants/sidebar.constants';
import { storage } from '../../../../shared/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  navItems = SIDEBAR_NAV_ITEMS;
  showFiller = false;
  isSidebarOpen: boolean = storage.get(SIDEBAR_CONFIG.CACHE_KEY, SIDEBAR_CONFIG.DEFAULT_OPENED) ?? SIDEBAR_CONFIG.DEFAULT_OPENED;

  toggleSidebar = () => {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.saveState();
  };

  closeSidebar = () => {
    this.isSidebarOpen = false;
    this.saveState();
  };

  openSidebar = () => {
    this.isSidebarOpen = true;
    this.saveState();
  };

  private saveState = () => storage.set(SIDEBAR_CONFIG.CACHE_KEY, this.isSidebarOpen);
}
