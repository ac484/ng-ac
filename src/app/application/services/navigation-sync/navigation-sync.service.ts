/**
 * @fileoverview 極簡導航同步服務 (Minimalist Navigation Sync Service)
 * @description 使用 Angular 20+ Signals 實現側邊欄和 Tab 的極簡同步
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 📋 檔案性質：
 * • 類型：Application Layer - Navigation Sync Service
 * • 依賴：Angular Core Signals
 * • 職責：極簡的導航狀態同步
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅負責狀態同步，不包含業務邏輯
 */

import { Injectable, signal, computed } from '@angular/core';

export interface NavigationState {
  /** 當前激活的路由 */
  activeRoute: string;
  /** 當前激活的 Tab ID */
  activeTabId: string;
  /** 展開的側邊欄群組 */
  expandedGroups: Set<string>;
}

@Injectable({ providedIn: 'root' })
export class NavigationSyncService {
  // 核心狀態 - 使用 Signals
  private readonly _state = signal<NavigationState>({
    activeRoute: '',
    activeTabId: '',
    expandedGroups: new Set<string>()
  });

  // 公開的唯讀狀態
  readonly state = this._state.asReadonly();
  
  // 計算屬性
  readonly activeRoute = computed(() => this._state().activeRoute);
  readonly activeTabId = computed(() => this._state().activeTabId);
  readonly expandedGroups = computed(() => this._state().expandedGroups);

  /**
   * 同步導航狀態
   */
  syncNavigation(route: string, tabId: string): void {
    this._state.update(current => ({
      ...current,
      activeRoute: route,
      activeTabId: tabId
    }));
  }

  /**
   * 切換側邊欄群組展開狀態
   */
  toggleGroup(group: string): void {
    this._state.update(current => {
      const newGroups = new Set(current.expandedGroups);
      if (newGroups.has(group)) {
        newGroups.delete(group);
      } else {
        newGroups.add(group);
      }
      return {
        ...current,
        expandedGroups: newGroups
      };
    });
  }

  /**
   * 檢查群組是否展開
   */
  isGroupExpanded(group: string): boolean {
    return this._state().expandedGroups.has(group);
  }

  /**
   * 檢查路由是否激活
   */
  isRouteActive(route: string): boolean {
    return this._state().activeRoute === route;
  }

  /**
   * 重置狀態
   */
  reset(): void {
    this._state.set({
      activeRoute: '',
      activeTabId: '',
      expandedGroups: new Set<string>()
    });
  }
}
