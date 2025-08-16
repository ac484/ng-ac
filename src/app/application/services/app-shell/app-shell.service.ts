/**
 * App Shell 應用服務
 * 負責 App Shell 的業務邏輯和狀態管理
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { computed, Injectable, signal } from '@angular/core';
import { IAppShell, IAppShellService } from '../../../shared/interfaces/app-shell';

@Injectable({ providedIn: 'root' })
export class AppShellService implements IAppShellService {
  private readonly _state = signal<IAppShell>({
    id: 'app-shell-default',
    isInitialized: false,
    isOnline: navigator.onLine,
    currentTheme: 'light',
    sidebarOpen: false
  });

  readonly state = this._state.asReadonly();
  readonly isInitialized = computed(() => this._state().isInitialized);
  readonly isOnline = computed(() => this._state().isOnline);
  readonly currentTheme = computed(() => this._state().currentTheme);
  readonly sidebarOpen = computed(() => this._state().sidebarOpen);

  async initialize(): Promise<void> {
    this._state.update(state => ({ ...state, isInitialized: true }));
  }

  getState(): IAppShell {
    return this._state();
  }

  toggleTheme(): void {
    this._state.update(state => ({
      ...state,
      currentTheme: state.currentTheme === 'light' ? 'dark' : 'light'
    }));
  }

  toggleSidebar(): void {
    this._state.update(state => ({
      ...state,
      sidebarOpen: !state.sidebarOpen
    }));
  }

  setOnlineStatus(isOnline: boolean): void {
    this._state.update(state => ({ ...state, isOnline }));
  }
}
