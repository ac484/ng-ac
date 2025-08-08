import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TabData {
  id: string;
  title: string;
  url: string;
  icon?: string;
  closable: boolean;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabsSubject = new BehaviorSubject<TabData[]>([]);
  private activeTabSubject = new BehaviorSubject<TabData | null>(null);

  constructor() {
    this.loadTabs();
  }

  get tabs$(): Observable<TabData[]> {
    return this.tabsSubject.asObservable();
  }

  get activeTab$(): Observable<TabData | null> {
    return this.activeTabSubject.asObservable();
  }

  get tabs(): TabData[] {
    return this.tabsSubject.value;
  }

  get activeTab(): TabData | null {
    return this.activeTabSubject.value;
  }

  createTab(title: string, url: string, icon?: string, closable = true): TabData {
    const existingTab = this.tabs.find(tab => tab.url === url);
    if (existingTab) {
      this.activateTab(existingTab.id);
      return existingTab;
    }

    const newTab: TabData = {
      id: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      title,
      url,
      icon,
      closable,
      active: false
    };

    const updatedTabs = [...this.tabs, newTab];
    this.tabsSubject.next(updatedTabs);
    this.saveTabs(updatedTabs);

    this.activateTab(newTab.id);
    return newTab;
  }

  activateTab(tabId: string): void {
    const tabs = this.tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));

    this.tabsSubject.next(tabs);
    this.activeTabSubject.next(tabs.find(tab => tab.active) || null);
    this.saveTabs(tabs);
  }

  closeTab(tabId: string): void {
    const tabs = this.tabs.filter(tab => tab.id !== tabId);

    if (tabs.length === 0) {
      this.tabsSubject.next([]);
      this.activeTabSubject.next(null);
      this.saveTabs([]);
      return;
    }

    // If we closed the active tab, activate the next available tab
    const wasActiveTab = this.activeTab?.id === tabId;
    if (wasActiveTab) {
      const nextTab = tabs[0];
      tabs[0] = { ...nextTab, active: true };
    }

    this.tabsSubject.next(tabs);
    this.activeTabSubject.next(tabs.find(tab => tab.active) || null);
    this.saveTabs(tabs);
  }

  private loadTabs(): void {
    try {
      const data = localStorage.getItem('ng_ac_tabs');
      if (data) {
        const tabs = JSON.parse(data);
        this.tabsSubject.next(tabs);
        this.activeTabSubject.next(tabs.find((tab: TabData) => tab.active) || null);
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
  }

  private saveTabs(tabs: TabData[]): void {
    try {
      localStorage.setItem('ng_ac_tabs', JSON.stringify(tabs));
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  }

  getRouteData(url: string): { title: string; icon?: string; closable: boolean } | null {
    const routeMap: Record<string, { title: string; icon?: string; closable: boolean }> = {
      '/dashboard': { title: '儀表板', icon: 'dashboard', closable: true }, // ✅ 改為可關閉
      '/dashboard/v1': { title: '儀表板', icon: 'dashboard', closable: true }, // ✅ 改為可關閉
      '/dashboard/analysis': { title: '分析', icon: 'bar-chart', closable: true },
      '/dashboard/monitor': { title: '監控', icon: 'monitor', closable: true },
      '/dashboard/workplace': { title: '工作台', icon: 'desktop', closable: true },
      '/dashboard/contract-management': { title: '合約管理', icon: 'file-text', closable: true },
      '/dashboard/task-management': { title: '任務管理', icon: 'check-square', closable: true },
      '/dashboard/budget-management': { title: '預算管理', icon: 'dollar', closable: true },
      '/dashboard/business-partner': { title: '業務夥伴', icon: 'user', closable: true }
    };

    return routeMap[url] || { title: '新頁面', closable: true };
  }

  // 更新所有現有標籤的 closable 屬性
  updateAllTabsClosable(): void {
    const updatedTabs = this.tabs.map(tab => {
      const routeData = this.getRouteData(tab.url);
      return {
        ...tab,
        closable: routeData?.closable ?? true
      };
    });

    this.tabsSubject.next(updatedTabs);
    this.saveTabs(updatedTabs);
  }
}
