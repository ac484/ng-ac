/**
 * @fileoverview App Shell 核心服務 (App Shell Core Service)
 * @description 負責管理應用骨架的狀態、主題、側邊欄等核心功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Application Layer App Shell Service
 * - 職責：App Shell 核心功能管理
 * - 依賴：Angular Core, Shared Layer
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 使用 Angular 20+ Signals 進行狀態管理
 * - 極簡主義設計，避免過度複雜化
 * - 支援主題切換和側邊欄控制
 * - 整合離線狀態管理
 */

import { computed, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'compact';
export type SidebarState = 'open' | 'closed' | 'collapsed';

@Injectable({ providedIn: 'root' })
export class AppShellService {
  // 主題狀態
  private readonly _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();

  // 側邊欄狀態
  private readonly _sidebarState = signal<SidebarState>('open');
  readonly sidebarState = this._sidebarState.asReadonly();

  // 計算屬性
  readonly isDarkTheme = computed(() => this._theme() === 'dark');
  readonly isSidebarOpen = computed(() => this._sidebarState() === 'open');

  constructor() {
    this.initializeTheme();
  }

  // 主題管理
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.applyTheme(theme);
    this.saveThemePreference(theme);
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // 側邊欄管理
  toggleSidebar(): void {
    const currentState = this._sidebarState();
    const newState = currentState === 'open' ? 'closed' : 'open';
    this._sidebarState.set(newState);
  }

  setSidebarState(state: SidebarState): void {
    this._sidebarState.set(state);
  }

  // 私有方法
  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private saveThemePreference(theme: Theme): void {
    localStorage.setItem('ng-ac-theme', theme);
  }

  private getSavedThemePreference(): Theme | null {
    return localStorage.getItem('ng-ac-theme') as Theme | null;
  }
}
