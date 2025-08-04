import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TabModel, TabEvent } from '../../domain/entities/tab.entity';
import { TabDomainService } from '../../domain/services/tab-domain.service';

/**
 * Application Service: Tab Application Service
 *
 * Coordinates between domain services and infrastructure layer.
 * Handles application-specific tab operations and orchestrates
 * the interaction between different layers.
 *
 * This service belongs to the Application layer as it coordinates
 * domain logic with infrastructure concerns.
 */
@Injectable({
  providedIn: 'root'
})
export class TabApplicationService {
  private readonly tabDomainService = inject(TabDomainService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Listen to router events and automatically add tabs
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed())
      .subscribe((event: any) => {
        this.handleRouteChange(event as NavigationEnd);
      });

    // Add initial dashboard tab
    setTimeout(() => {
      const initialTab: TabModel = {
        title: '儀表板',
        path: '/dashboard',
        snapshotArray: []
      };
      this.addTab(initialTab);
    }, 100);
  }

  /**
   * Handle route changes and add tabs automatically
   */
  private handleRouteChange(event: NavigationEnd): void {
    const url = event.urlAfterRedirects;
    const title = this.getRouteTitle(url);

    // Skip root path and passport routes
    if (title && url !== '/' && !url.startsWith('/passport')) {
      const tabModel: TabModel = {
        title,
        path: url,
        snapshotArray: [this.activatedRoute.snapshot]
      };

      this.addTab(tabModel);
    }
  }

  /**
   * Get route title from URL
   */
  private getRouteTitle(url: string): string {
    // Simple mapping of routes to titles
    const routeTitles: Record<string, string> = {
      '/dashboard': '儀表板',
      '/accounts': '帳戶管理',
      '/transactions': '交易管理',
      '/users': '用戶管理',
      '/contracts': '合約管理',
      '/contracts/create': '新增合約',
      '/principal': 'Principal 管理',
      '/pro/account/center': '個人中心',
      '/pro/account/settings': '個人設置'
    };

    // Check for exact match first
    if (routeTitles[url]) {
      return routeTitles[url];
    }

    // Check for pattern matches (for dynamic routes)
    if (url.startsWith('/contracts/') && url !== '/contracts') {
      const parts = url.split('/');
      if (parts.length === 3 && parts[2] !== 'create') {
        return `合約詳情 #${parts[2]}`;
      }
    }

    if (url.startsWith('/accounts/')) {
      return '帳戶詳情';
    }

    if (url.startsWith('/transactions/')) {
      return '交易詳情';
    }

    if (url.startsWith('/users/')) {
      return '用戶詳情';
    }

    if (url.startsWith('/principal/')) {
      return 'Principal 詳情';
    }

    // Generate unique title for unknown routes
    const timestamp = Date.now();
    return `頁面_${timestamp}`;
  }

  /**
   * Get observable of current tab array
   */
  getTabArray$(): Observable<TabModel[]> {
    return this.tabDomainService.getTabArray$();
  }

  /**
   * Get current tab array
   */
  getTabArray(): TabModel[] {
    return this.tabDomainService.getTabArray();
  }

  /**
   * Get current tab index
   */
  getCurrentTabIndex(): number {
    return this.tabDomainService.getCurrentTabIndex();
  }

  /**
   * Add a new tab
   */
  addTab(tabModel: TabModel, isNewTabDetailPage = false): void {
    // Validate tab can be added
    if (!this.tabDomainService.canAddTab(tabModel)) {
      return;
    }

    const currentTabs = this.getTabArray();

    // Check if tab already exists by path
    const existingTabIndex = currentTabs.findIndex(tab => tab.path === tabModel.path);
    if (existingTabIndex !== -1) {
      // Update existing tab
      currentTabs[existingTabIndex] = tabModel;
      this.setCurrentTabIndex(existingTabIndex);
    } else {
      // Add new tab
      currentTabs.push(tabModel);
      this.setCurrentTabIndex(currentTabs.length - 1);
    }

    this.updateTabArray(currentTabs);
  }

  /**
   * Remove a tab by index
   */
  removeTab(tabIndex: number): void {
    if (!this.tabDomainService.canRemoveTab(tabIndex)) {
      return;
    }

    const currentTabs = this.getTabArray();
    const currentIndex = this.getCurrentTabIndex();

    // Handle navigation logic
    if (tabIndex === currentIndex) {
      // Remove current tab and navigate to previous
      currentTabs.splice(tabIndex, 1);
      const newIndex = tabIndex - 1 < 0 ? 0 : tabIndex - 1;
      this.setCurrentTabIndex(newIndex);
      this.router.navigateByUrl(currentTabs[newIndex]?.path || '/dashboard');
    } else if (tabIndex < currentIndex) {
      // Remove tab on the left, adjust current index
      currentTabs.splice(tabIndex, 1);
      this.setCurrentTabIndex(currentIndex - 1);
    } else {
      // Remove tab on the right
      currentTabs.splice(tabIndex, 1);
    }

    this.updateTabArray(currentTabs);
  }

  /**
   * Remove all tabs to the right of specified index
   */
  removeRightTabs(tabIndex: number): void {
    const currentTabs = this.getTabArray();
    const currentIndex = this.getCurrentTabIndex();

    // Get tabs to be removed
    const tabsToRemove = currentTabs.filter((_, index) => index > tabIndex);

    // Remove right tabs
    currentTabs.length = tabIndex + 1;

    // Handle navigation if current tab is being removed
    if (tabIndex < currentIndex) {
      this.router.navigateByUrl(currentTabs[tabIndex].path);
    }

    this.updateTabArray(currentTabs);
  }

  /**
   * Remove all tabs to the left of specified index
   */
  removeLeftTabs(tabIndex: number): void {
    const currentTabs = this.getTabArray();
    const currentIndex = this.getCurrentTabIndex();

    // Get tabs to be removed
    const tabsToRemove = currentTabs.filter((_, index) => index < tabIndex);

    // Handle index adjustment
    if (currentIndex === tabIndex) {
      this.setCurrentTabIndex(0);
    } else if (currentIndex < tabIndex) {
      this.setCurrentTabIndex(0);
    } else if (currentIndex > tabIndex) {
      this.setCurrentTabIndex(currentIndex - tabsToRemove.length);
    }

    // Remove left tabs
    currentTabs.splice(0, tabIndex);
    this.updateTabArray(currentTabs);
    this.router.navigateByUrl(currentTabs[this.getCurrentTabIndex()].path);
  }

  /**
   * Remove all other tabs except the specified one
   */
  removeOtherTabs(tabIndex: number): void {
    const currentTabs = this.getTabArray();
    const targetTab = currentTabs[tabIndex];

    // Keep only the target tab
    this.updateTabArray([targetTab]);
    this.setCurrentTabIndex(0);
    this.router.navigateByUrl(targetTab.path);
  }

  /**
   * Change tab title
   */
  changeTabTitle(title: string): void {
    const currentTabs = this.getTabArray();
    const currentIndex = this.getCurrentTabIndex();

    if (currentTabs[currentIndex]) {
      currentTabs[currentIndex].title = title;
      this.updateTabArray(currentTabs);
    }
  }

  /**
   * Find tab index by path
   */
  findTabIndexByPath(path: string): number {
    const index = this.tabDomainService.findTabIndexByPath(path);
    this.setCurrentTabIndex(index);
    return index;
  }

  /**
   * Navigate to tab
   */
  navigateToTab(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }

  /**
   * Clear all tabs
   */
  clearAllTabs(): void {
    this.updateTabArray([]);
    this.setCurrentTabIndex(0);
  }

  /**
   * Update tab array and notify observers
   */
  private updateTabArray(tabs: TabModel[]): void {
    this.tabDomainService.setTabArray(tabs);
  }

  /**
   * Set current tab index
   */
  private setCurrentTabIndex(index: number): void {
    this.tabDomainService.setCurrentTabIndex(index);
  }
}
