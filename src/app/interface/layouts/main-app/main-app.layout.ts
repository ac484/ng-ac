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
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SIDEBAR_NAV_ITEMS, type SidebarItem } from '../../../shared/constants/sidebar/sidebar.constants';
import { TabNavigationComponent } from '../../components/common/tab-navigation';
import { AppShellModernComponent } from '../../components/layout/app-shell-modern';
import { FooterComponent } from '../../components/layout/footer';
import { HeaderComponent } from '../../components/layout/header';

@Component({
  selector: 'app-main-app-layout',
  standalone: true,
  imports: [CommonModule, AppShellModernComponent, HeaderComponent, FooterComponent, TabNavigationComponent, RouterOutlet, RouterLink],
  template: `
    <app-shell-modern>
      <div shell-sidenav style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <nav style="display: flex; flex-direction: column; gap: 6px;">
          @for (item of navItems; track item.label) {
            @if (!item.children) {
              <a routerLink="{{ item.route }}">{{ item.label }}</a>
            } @else {
              <a href (click)="toggleGroup(item.label); $event.preventDefault()">
                {{ item.label }} {{ expanded(item.label) ? '▾' : '▸' }}
              </a>
              @if (expanded(item.label)) {
                <div style="padding-left: 12px; display: flex; flex-direction: column; gap: 4px;">
                  @for (child of item.children; track child.route) {
                    <a routerLink="{{ child.route }}">{{ child.label }}</a>
                  }
                </div>
              }
            }
          }
        </nav>
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
  private expandedGroups = new Set<string>();

  expanded(label: string): boolean {
    return this.expandedGroups.has(label);
  }

  toggleGroup(label: string): void {
    if (this.expandedGroups.has(label)) this.expandedGroups.delete(label);
    else this.expandedGroups.add(label);
  }
}


