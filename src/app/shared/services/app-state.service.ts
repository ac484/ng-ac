/**
 * @ai-context {
 *   "role": "Shared/Service",
 *   "purpose": "應用狀態管理-全局狀態協調",
 *   "constraints": ["Signals優先", "不可變狀態", "極簡實現"],
 *   "dependencies": ["@angular/core", "PerformanceService"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage appState.setTheme('dark'), appState.theme()
 * @see docs/architecture/shared.md
 */
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PerformanceService } from './performance.service';

export interface AppTheme {
  mode: 'light' | 'dark';
  primary: string;
  accent: string;
}

export interface AppSettings {
  language: 'zh-TW' | 'en-US';
  notifications: boolean;
  autoSave: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly performanceService = inject(PerformanceService);

  // 私有狀態 Signals
  private readonly _theme = signal<AppTheme>({
    mode: 'light',
    primary: '#1976d2',
    accent: '#ff4081'
  });

  private readonly _settings = signal<AppSettings>({
    language: 'zh-TW',
    notifications: true,
    autoSave: true
  });

  private readonly _isOnline = signal(navigator.onLine);

  // 公開只讀狀態
  readonly theme = this._theme.asReadonly();
  readonly settings = this._settings.asReadonly();
  readonly isOnline = this._isOnline.asReadonly();

  // 計算屬性
  readonly isDarkMode = computed(() => this._theme().mode === 'dark');
  readonly currentLanguage = computed(() => this._settings().language);

  constructor() {
    this.initializeState();
    this.setupEffects();
  }

  // 主題管理
  setTheme(mode: 'light' | 'dark'): void {
    this._theme.update(theme => ({ ...theme, mode }));
    this.performanceService.trackEvent('theme_changed', 1, 'custom');
  }

  toggleTheme(): void {
    const newMode = this.isDarkMode() ? 'light' : 'dark';
    this.setTheme(newMode);
  }

  // 設置管理
  updateSettings(updates: Partial<AppSettings>): void {
    this._settings.update(settings => ({ ...settings, ...updates }));
  }

  // 網路狀態管理
  private initializeState(): void {
    window.addEventListener('online', () => this._isOnline.set(true));
    window.addEventListener('offline', () => this._isOnline.set(false));
  }

  private setupEffects(): void {
    // 主題變更時更新 DOM
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme.mode);
      document.documentElement.classList.toggle('dark-theme', theme.mode === 'dark');
    });

    // 語言變更時更新文檔
    effect(() => {
      const language = this.currentLanguage();
      document.documentElement.lang = language;
    });
  }
}
