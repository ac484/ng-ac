import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TabModel, TabStatus, TabConfig, TabEvent } from '../entities/tab.entity';

/**
 * Domain Service: Tab Domain Service
 * 
 * Contains core business logic for tab management including:
 * - Tab validation rules
 * - Tab state management
 * - Tab business rules
 * 
 * This service belongs to the Domain layer as it encapsulates
 * domain-specific business logic and rules.
 */
@Injectable({
  providedIn: 'root'
})
export class TabDomainService {
  private readonly tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private readonly currentTabIndex$ = new BehaviorSubject<number>(0);
  private readonly tabConfig: TabConfig = {
    closable: true,
    refreshable: true,
    keepAlive: true,
    maxTabs: 20
  };

  /**
   * Get observable of current tab array
   */
  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  /**
   * Get current tab array
   */
  getTabArray(): TabModel[] {
    return this.tabArray$.value;
  }

  /**
   * Set tab array and notify observers
   */
  setTabArray(tabs: TabModel[]): void {
    this.tabArray$.next(tabs);
  }

  /**
   * Get current tab index
   */
  getCurrentTabIndex(): number {
    return this.currentTabIndex$.value;
  }

  /**
   * Set current tab index
   */
  setCurrentTabIndex(index: number): void {
    this.currentTabIndex$.next(index);
  }

  /**
   * Get tab configuration
   */
  getTabConfig(): TabConfig {
    return this.tabConfig;
  }

  /**
   * Validate if a tab can be added
   */
  canAddTab(tab: TabModel): boolean {
    const currentTabs = this.getTabArray();
    
    // Check if tab already exists
    const existingTab = currentTabs.find(t => t.path === tab.path);
    if (existingTab) {
      return false;
    }

    // Check max tabs limit
    if (currentTabs.length >= this.tabConfig.maxTabs) {
      return false;
    }

    // Validate tab properties
    if (!tab.title || !tab.path) {
      return false;
    }

    return true;
  }

  /**
   * Validate if a tab can be removed
   */
  canRemoveTab(tabIndex: number): boolean {
    const currentTabs = this.getTabArray();
    
    if (tabIndex < 0 || tabIndex >= currentTabs.length) {
      return false;
    }

    // Cannot remove the last tab if it's the only one
    if (currentTabs.length === 1) {
      return false;
    }

    return true;
  }

  /**
   * Find tab index by path
   */
  findTabIndexByPath(path: string): number {
    const currentTabs = this.getTabArray();
    return currentTabs.findIndex(tab => tab.path === path);
  }

  /**
   * Check if tab exists by path
   */
  tabExists(path: string): boolean {
    return this.findTabIndexByPath(path) !== -1;
  }

  /**
   * Get tab by index
   */
  getTabByIndex(index: number): TabModel | null {
    const currentTabs = this.getTabArray();
    return index >= 0 && index < currentTabs.length ? currentTabs[index] : null;
  }

  /**
   * Get current active tab
   */
  getCurrentTab(): TabModel | null {
    const currentIndex = this.getCurrentTabIndex();
    return this.getTabByIndex(currentIndex);
  }

  /**
   * Create tab event for domain event handling
   */
  createTabEvent(type: TabEvent['type'], tab: TabModel): TabEvent {
    return {
      type,
      tab,
      timestamp: new Date()
    };
  }
} 