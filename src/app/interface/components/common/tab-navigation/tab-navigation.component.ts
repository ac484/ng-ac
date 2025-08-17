/**
 * @fileoverview Tab Navigation 組件檔案 (Tab Navigation Component)
 * @description 提供 Tab Navigation 系統的 UI 組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Tab Navigation Component
 * - 職責：Tab 導航 UI 組件
 * - 依賴：Tab Navigation Service、Material Tabs
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用 Angular 20+ 和 Material Tabs API
 * - 遵循極簡主義原則，只實現必要的功能
 * - 使用官方 Angular Material Tabs 組件
 *
 * @module TabNavigation
 * @layer Interface
 * @context Tab Navigation UI
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { TabNavigationService } from '../../../../application/services/tab-navigation/tab-navigation.service';

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    RouterOutlet
  ],
  template: `
    @if (tabService.hasTabs()) {
      <mat-tab-group
        [selectedIndex]="activeTabIndex()"
        (selectedIndexChange)="onTabChange($event)"
        class="modern-tab-group">

        @for (tab of tabService.tabs(); track tab.id; let i = $index) {
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label-content">
                @if (tab.icon) {
                  <mat-icon class="tab-icon">{{ tab.icon }}</mat-icon>
                }
                <span class="tab-text">{{ tab.label }}</span>

                @if (tab.closable) {
                  <button
                    mat-icon-button
                    class="close-button"
                    (click)="closeTab(tab.id, $event)"
                    [attr.aria-label]="'Close ' + tab.label + ' tab'">
                    <mat-icon>close</mat-icon>
                  </button>
                }
              </div>
            </ng-template>

            <ng-template mat-tab-content>
              <div class="tab-content" [attr.data-tab-id]="tab.id">
                @if (tab.component) {
                  <ng-container *ngComponentOutlet="tab.component; inputs: tab.data || {}">
                  </ng-container>
                } @else {
                  <router-outlet [name]="tab.id"></router-outlet>
                }
              </div>
            </ng-template>
          </mat-tab>
        }
      </mat-tab-group>
    }
  `,
  styleUrls: ['./tab-navigation.component.scss']
})
export class TabNavigationComponent {
  readonly tabService = inject(TabNavigationService);

  // 計算屬性
  readonly activeTabIndex = computed(() => {
    const tabs = this.tabService.tabs();
    const activeId = this.tabService.activeTabId();
    return tabs.findIndex(tab => tab.id === activeId);
  });

  // 事件處理
  onTabChange(index: number): void {
    const tabs = this.tabService.tabs();
    if (tabs[index]) {
      this.tabService.activateTab(tabs[index].id);
    }
  }

  closeTab(tabId: string, event: Event): void {
    event.stopPropagation();
    this.tabService.closeTab(tabId);
  }
}
