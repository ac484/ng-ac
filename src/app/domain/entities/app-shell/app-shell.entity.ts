/**
 * App Shell 實體
 * 負責管理應用骨架的核心狀態和行為
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { BaseEntity } from '../../base/base.entity';

export interface AppShellState {
  isInitialized: boolean;
  isOnline: boolean;
  currentTheme: 'light' | 'dark';
  sidebarOpen: boolean;
}

export class AppShellEntity extends BaseEntity {
  private _state: AppShellState;

  constructor(id: string) {
    super(id);
    this._state = {
      isInitialized: false,
      isOnline: navigator.onLine,
      currentTheme: 'light',
      sidebarOpen: false
    };
  }

  get state(): AppShellState {
    return { ...this._state };
  }

  initialize(): void {
    this._state.isInitialized = true;
  }

  setOnlineStatus(isOnline: boolean): void {
    this._state.isOnline = isOnline;
  }

  toggleTheme(): void {
    this._state.currentTheme = this._state.currentTheme === 'light' ? 'dark' : 'light';
  }

  toggleSidebar(): void {
    this._state.sidebarOpen = !this._state.sidebarOpen;
  }
}
