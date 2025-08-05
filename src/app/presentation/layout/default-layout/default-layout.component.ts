import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';

import { LayoutApplicationService } from '../../../application/layout/layout.application.service';
import { TabApplicationService } from '../../../application/layout/tab.application.service';
import { Layout, LayoutMode, ThemeMode } from '../../../domain/layout/layout.entity';
import { Tab } from '../../../domain/layout/tab.entity';
import { SidebarComponent } from '../sidebar/sidebar.component
import { HeaderComponent } from '../header/header.component';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule,
    NzButtonModule,
    NzMenuModule,
    NzNoAnimationModule,
    NzCardModule,
    NzTabsModule,
    NzDropDownModule,
    NzMessageModule,
    SidebarComponent,
    HeaderComponent,
    TabComponent,
    RouterOutlet
  ],
  providers: [NzMessageService]
})
export class DefaultLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutApplicationService);
  private readonly tabService = inject(TabApplicationService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  layout: Layout | null = null;
  tabs: Tab[] = [];
  currentTab: Tab | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.loadLayout();
    await this.loadTabs();
  }

  private async loadLayout(): Promise<void> {
    try {
      const layouts = await this.layoutService.repository.findAll();
      this.layout = layouts.length > 0 ? layouts[0] : await this.createDefaultLayout();
    } catch (error) {
      console.error('Failed to load layout:', error);
      this.layout = await this.createDefaultLayout();
    }
  }

  private async loadTabs(): Promise<void> {
    try {
      this.tabs = await this.tabService.repository.findAll();
      this.currentTab = this.tabs.find(tab => tab.isActive) || null;
    } catch (error) {
      console.error('Failed to load tabs:', error);
      this.tabs = [];
    }
  }

  private async createDefaultLayout(): Promise<Layout> {
    const defaultLayout = await this.layoutService.create({
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
    return defaultLayout;
  }

  async toggleCollapsed(): Promise<void> {
    if (this.layout) {
      await this.layoutService.toggleCollapsed();
      await this.loadLayout();
    }
  }

  async setMode(mode: LayoutMode): Promise<void> {
    if (this.layout) {
      await this.layoutService.setMode(mode);
      await this.loadLayout();
    }
  }

  async setTheme(theme: ThemeMode): Promise<void> {
    if (this.layout) {
      await this.layoutService.setTheme(theme);
      await this.loadLayout();
    }
  }

  async addTab(title: string, path: string): Promise<void> {
    try {
      await this.tabService.addTab(title, path);
      await this.loadTabs();
    } catch (error) {
      console.error('Failed to add tab:', error);
      this.message.error('Failed to add tab');
    }
  }

  async closeTab(tabId: string): Promise<void> {
    try {
      await this.tabService.closeTab(tabId);
      await this.loadTabs();
      
      // Navigate to first available tab or dashboard
      if (this.tabs.length > 0) {
        this.router.navigate([this.tabs[0].path]);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Failed to close tab:', error);
      this.message.error('Failed to close tab');
    }
  }

  async closeOtherTabs(tabId: string): Promise<void> {
    try {
      await this.tabService.closeOtherTabs(tabId);
      await this.loadTabs();
    } catch (error) {
      console.error('Failed to close other tabs:', error);
      this.message.error('Failed to close other tabs');
    }
  }

  async closeRightTabs(tabId: string): Promise<void> {
    try {
      await this.tabService.closeRightTabs(tabId);
      await this.loadTabs();
    } catch (error) {
      console.error('Failed to close right tabs:', error);
      this.message.error('Failed to close right tabs');
    }
  }

  async closeLeftTabs(tabId: string): Promise<void> {
    try {
      await this.tabService.closeLeftTabs(tabId);
      await this.loadTabs();
    } catch (error) {
      console.error('Failed to close left tabs:', error);
      this.message.error('Failed to close left tabs');
    }
  }

  async setActiveTab(tabId: string): Promise<void> {
    try {
      await this.tabService.setActiveTab(tabId);
      await this.loadTabs();
      
      const activeTab = this.tabs.find(tab => tab.id === tabId);
      if (activeTab) {
        this.router.navigate([activeTab.path]);
      }
    } catch (error) {
      console.error('Failed to set active tab:', error);
      this.message.error('Failed to set active tab');
    }
  }

  async refreshTab(tabId: string): Promise<void> {
    try {
      await this.tabService.refreshTab(tabId);
      this.message.success('Tab refreshed');
    } catch (error) {
      console.error('Failed to refresh tab:', error);
      this.message.error('Failed to refresh tab');
    }
  }
} 