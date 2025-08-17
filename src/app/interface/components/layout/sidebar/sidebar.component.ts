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
  private readonly router = inject(Router);

  // 計算屬性
  readonly isRouteActive = (route?: string) =>
    route ? this.navigationSync.isRouteActive(route) : false;

  readonly isGroupExpanded = (group: string) =>
    this.navigationSync.isGroupExpanded(group);

  // 事件處理
  onItemClick(item: SidebarItem): void {
    if (!item.route) return;

    // 同步導航狀態
    this.navigationSync.syncNavigation(item.route, '');

    // 導航到路由
    this.router.navigate([item.route]);
  }

  onChildClick(child: { label: string; route: string }): void {
    // 同步導航狀態
    this.navigationSync.syncNavigation(child.route, '');

    // 導航到路由
    this.router.navigate([child.route]);
  }

  toggleGroup(group: string): void {
    this.navigationSync.toggleGroup(group);
  }
}
