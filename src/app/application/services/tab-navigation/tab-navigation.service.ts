/**
 * @fileoverview Tab Navigation 服務檔案 (Tab Navigation Service)
 * @description 提供 Tab Navigation 系統的核心服務
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Application Layer Tab Navigation Service
 * - 職責：Tab 導航服務
 * - 依賴：Tab 介面、工具函數、Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用 Angular 20+ Signals 進行狀態管理
 * - 遵循極簡主義原則，只實現必要的功能
 * - 使用官方 Angular Material Tabs API 規範
 */

import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SIDEBAR_NAV_ITEMS } from '../../../shared/constants/sidebar/sidebar.constants';
import { TAB_CONFIG } from '../../../shared/constants/tab/tab.constants';
import { TabItem } from '../../../shared/interfaces/tab/tab.interface';
import { storage } from '../../../shared/utils';
import { canAddTab, generateTabId, getTabIndex, hasTab } from '../../../shared/utils/tab/tab.util';

@Injectable({ providedIn: 'root' })
export class TabNavigationService {
  private router = inject(Router);

  // 核心 Signals
  private readonly _tabs = signal<TabItem[]>([]);
  private readonly _activeTabId = signal<string | null>(null);

  // 計算 Signals
  readonly tabs = this._tabs.asReadonly();
  readonly activeTabId = this._activeTabId.asReadonly();
  readonly activeTab = computed(() =>
    this._tabs().find(tab => tab.id === this._activeTabId())
  );
  readonly hasTabs = computed(() => this._tabs().length > 0);
  readonly canCloseTabs = computed(() =>
    this._tabs().some(tab => tab.closable)
  );

  constructor() {
    this.loadState();

    // 自動路由同步
    effect(() => {
      const currentRoute = this.router.url;

      // 僅在主應用路由下處理自動建 tab
      if (!currentRoute.startsWith('/app')) {
        return;
      }

      const tabs = this._tabs();
      const matchingTab = tabs.find(tab => tab.route === currentRoute);

      if (!matchingTab) {
        const meta = this.findMenuMeta(currentRoute);
        // 僅對有對應側邊欄定義的路由建立 tab
        if (meta && canAddTab(tabs, TAB_CONFIG.MAX_TABS)) {
          const newId = this.addTab({
            label: meta.label,
            route: currentRoute,
            icon: meta.icon,
            closable: currentRoute !== '/app/dashboard'
          });
          this._activeTabId.set(newId);
        }
        return;
      }

      if (matchingTab.id !== this._activeTabId()) {
        this._activeTabId.set(matchingTab.id);
      }
    });
  }

  // 操作方法
  addTab(tab: Omit<TabItem, 'id'>): string {
    if (!canAddTab(this._tabs(), TAB_CONFIG.MAX_TABS)) {
      throw new Error(`Cannot add more than ${TAB_CONFIG.MAX_TABS} tabs`);
    }

    const id = generateTabId();
    const newTab: TabItem = { ...tab, id };

    this._tabs.update(tabs => [...tabs, newTab]);

    if (!this._activeTabId()) {
      this._activeTabId.set(id);
    }

    this.saveState();
    return id;
  }

  closeTab(tabId: string): void {
    const tabs = this._tabs();
    const tabIndex = getTabIndex(tabs, tabId);

    if (tabIndex === -1) return;

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    this._tabs.set(newTabs);

    // 自動選擇下一個標籤
    if (this._activeTabId() === tabId) {
      const nextTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
      if (nextTab) {
        this._activeTabId.set(nextTab.id);
        this.router.navigate([nextTab.route]);
      }
    }

    this.saveState();
  }

  activateTab(tabId: string): void {
    const tab = this._tabs().find(t => t.id === tabId);
    if (tab) {
      this._activeTabId.set(tabId);
      this.router.navigate([tab.route]);
      this.saveState();
    }
  }

  // 私有方法
  private loadState(): void {
    try {
      const savedTabs = storage.get<TabItem[]>(TAB_CONFIG.CACHE_KEY, []);
      const savedActiveId = storage.get<string>(`${TAB_CONFIG.CACHE_KEY}-active`, '');

      if (savedTabs && savedTabs.length > 0) {
        this._tabs.set(savedTabs);
        if (savedActiveId && hasTab(savedTabs, savedActiveId)) {
          this._activeTabId.set(savedActiveId);
        }
      }
    } catch (error) {
      console.warn('Failed to load tab state:', error);
    }
  }

  private saveState(): void {
    try {
      storage.set(TAB_CONFIG.CACHE_KEY, this._tabs());
      storage.set(`${TAB_CONFIG.CACHE_KEY}-active`, this._activeTabId());
    } catch (error) {
      console.warn('Failed to save tab state:', error);
    }
  }

  /**
   * 依據當前路由尋找側邊欄定義的標籤資料
   */
  private findMenuMeta(route: string): { label: string; icon?: string } | null {
    const direct = SIDEBAR_NAV_ITEMS.find(item => item.route === route);
    if (direct) return { label: direct.label, icon: direct.icon };

    for (const item of SIDEBAR_NAV_ITEMS) {
      if (!item.children) continue;
      const found = item.children.find(child => child.route === route);
      if (found) return { label: found.label, icon: item.icon };
    }
    return null;
  }
}
