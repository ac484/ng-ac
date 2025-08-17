/**
 * @fileoverview 極簡側邊欄組件 (Minimalist Sidebar Component)
 * @description 使用純 HTML + CSS 實現的極簡側邊欄，配合 NavigationSyncService
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Layout Component
 * • 依賴：NavigationSyncService, SidebarItem
 * • 職責：極簡側邊欄渲染和交互
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅負責 UI 渲染，不包含業務邏輯
 */

import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationSyncService } from '../../../../application/services/navigation-sync';
import { TabNavigationService } from '../../../../application/services/tab-navigation';
import { SidebarItem } from '../../../../shared/constants/sidebar/sidebar.constants';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-content">
        @for (item of navItems; track item.label) {
          @if (!item.children) {
            <div
              class="nav-item"
              [class.active]="isRouteActive(item.route)"
              (click)="onItemClick(item)">
              @if (item.icon) {
                <span class="nav-icon">{{ item.icon }}</span>
              }
              <span class="nav-label">{{ item.label }}</span>
            </div>
          } @else {
            <div class="nav-group">
              <div
                class="nav-group-header"
                [class.expanded]="isGroupExpanded(item.label)"
                (click)="toggleGroup(item.label)">
                @if (item.icon) {
                  <span class="nav-icon">{{ item.icon }}</span>
                }
                <span class="nav-label">{{ item.label }}</span>
                <span class="nav-arrow">{{ isGroupExpanded(item.label) ? '▾' : '▸' }}</span>
              </div>

              @if (isGroupExpanded(item.label)) {
                <div class="nav-group-children">
                  @for (child of item.children; track child.route) {
                    <div
                      class="nav-item nav-child"
                      [class.active]="isRouteActive(child.route)"
                      (click)="onChildClick(child)">
                      <span class="nav-label">{{ child.label }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </nav>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() navItems: SidebarItem[] = [];

  private readonly navigationSync = inject(NavigationSyncService);
  private readonly tabService = inject(TabNavigationService);
  private readonly router = inject(Router);

  // 計算屬性
  readonly isRouteActive = (route?: string) =>
    route ? this.navigationSync.isRouteActive(route) : false;

  readonly isGroupExpanded = (group: string) =>
    this.navigationSync.isGroupExpanded(group);

  // 事件處理
  onItemClick(item: SidebarItem): void {
    if (!item.route) return;

    // 檢查是否已存在對應的 Tab
    const tabs = this.tabService.tabs();
    const existingTab = tabs.find(t => t.route === item.route);

    const tabId = existingTab
      ? existingTab.id
      : this.tabService.addTab({
          label: item.label,
          route: item.route,
          icon: item.icon,
          closable: item.route !== '/app/blank'
        });

    this.tabService.activateTab(tabId);

    // 同步導航狀態（帶入實際 tabId）
    this.navigationSync.syncNavigation(item.route, tabId);
  }

  onChildClick(child: { label: string; route: string }): void {
    // 檢查是否已存在對應的 Tab
    const tabs = this.tabService.tabs();
    const existingTab = tabs.find(t => t.route === child.route);

    const tabId = existingTab
      ? existingTab.id
      : this.tabService.addTab({
          label: child.label,
          route: child.route,
          icon: undefined,
          closable: child.route !== '/app/blank'
        });

    this.tabService.activateTab(tabId);

    // 同步導航狀態（帶入實際 tabId）
    this.navigationSync.syncNavigation(child.route, tabId);
  }

  toggleGroup(group: string): void {
    this.navigationSync.toggleGroup(group);
  }
}
