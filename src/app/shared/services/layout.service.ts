import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutApplicationService } from '../../application/layout/layout.application.service';
import { TabApplicationService } from '../../application/layout/tab.application.service';
import { Layout } from '../../domain/layout/layout.entity';
import { Tab } from '../../domain/layout/tab.entity';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly layoutService = inject(LayoutApplicationService);
  private readonly tabService = inject(TabApplicationService);

  private layoutSubject = new BehaviorSubject<Layout | null>(null);
  private tabsSubject = new BehaviorSubject<Tab[]>([]);
  private currentTabSubject = new BehaviorSubject<Tab | null>(null);

  layout$ = this.layoutSubject.asObservable();
  tabs$ = this.tabsSubject.asObservable();
  currentTab$ = this.currentTabSubject.asObservable();

  async loadLayout(): Promise<void> {
    try {
      const layouts = await this.layoutService.repository.findAll();
      const layout = layouts.length > 0 ? layouts[0] : await this.createDefaultLayout();
      this.layoutSubject.next(layout);
    } catch (error) {
      console.error('Failed to load layout:', error);
      const defaultLayout = await this.createDefaultLayout();
      this.layoutSubject.next(defaultLayout);
    }
  }

  async loadTabs(): Promise<void> {
    try {
      const tabs = await this.tabService.repository.findAll();
      this.tabsSubject.next(tabs);
      
      const currentTab = tabs.find(tab => tab.isActive) || null;
      this.currentTabSubject.next(currentTab);
    } catch (error) {
      console.error('Failed to load tabs:', error);
      this.tabsSubject.next([]);
      this.currentTabSubject.next(null);
    }
  }

  async toggleCollapsed(): Promise<void> {
    await this.layoutService.toggleCollapsed();
    await this.loadLayout();
  }

  async setMode(mode: 'side' | 'top' | 'mixin'): Promise<void> {
    await this.layoutService.setMode(mode);
    await this.loadLayout();
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.layoutService.setTheme(theme);
    await this.loadLayout();
  }

  async addTab(title: string, path: string): Promise<void> {
    await this.tabService.addTab(title, path);
    await this.loadTabs();
  }

  async closeTab(tabId: string): Promise<void> {
    await this.tabService.closeTab(tabId);
    await this.loadTabs();
  }

  async closeOtherTabs(tabId: string): Promise<void> {
    await this.tabService.closeOtherTabs(tabId);
    await this.loadTabs();
  }

  async closeRightTabs(tabId: string): Promise<void> {
    await this.tabService.closeRightTabs(tabId);
    await this.loadTabs();
  }

  async closeLeftTabs(tabId: string): Promise<void> {
    await this.tabService.closeLeftTabs(tabId);
    await this.loadTabs();
  }

  async setActiveTab(tabId: string): Promise<void> {
    await this.tabService.setActiveTab(tabId);
    await this.loadTabs();
  }

  async refreshTab(tabId: string): Promise<void> {
    await this.tabService.refreshTab(tabId);
  }

  private async createDefaultLayout(): Promise<Layout> {
    return await this.layoutService.create({
      mode: 'side',
      isCollapsed: false,
      isFixedHeader: false,
      isFixedSidebar: false,
      isShowTab: true,
      isFixedTab: false,
      theme: 'light',
      sidebarWidth: 200,
      collapsedWidth: 80
    });
  }
} 