import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme, ThemeSettings, ThemeType, ThemeMode } from '../../domain/theme/theme.entity';
import { ThemeRepository } from '../../domain/theme/theme.repository';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeRepository = inject(ThemeRepository);
  
  private readonly _currentTheme$ = new BehaviorSubject<Theme | null>(null);
  private readonly _isDarkTheme$ = new BehaviorSubject<boolean>(false);
  private readonly _settings$ = new BehaviorSubject<ThemeSettings | null>(null);

  constructor() {
    this.initializeTheme();
  }

  // 公開的 Observable
  get currentTheme$(): Observable<Theme | null> {
    return this._currentTheme$.asObservable();
  }

  get isDarkTheme$(): Observable<boolean> {
    return this._isDarkTheme$.asObservable();
  }

  get settings$(): Observable<ThemeSettings | null> {
    return this._settings$.asObservable();
  }

  // 獲取當前主題
  get currentTheme(): Theme | null {
    return this._currentTheme$.value;
  }

  // 初始化主題
  private async initializeTheme(): Promise<void> {
    try {
      const theme = await this.themeRepository.getCurrentTheme();
      this._currentTheme$.next(theme);
      this._isDarkTheme$.next(theme.isDarkTheme);
      this._settings$.next(theme.settings);
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      // 使用默認主題
      const defaultTheme = new Theme();
      this._currentTheme$.next(defaultTheme);
      this._isDarkTheme$.next(defaultTheme.isDarkTheme);
      this._settings$.next(defaultTheme.settings);
    }
  }

  // 切換主題
  async toggleTheme(): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.toggleTheme();
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._isDarkTheme$.next(currentTheme.isDarkTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 更新主色調
  async updatePrimaryColor(color: string): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.updatePrimaryColor(color);
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 更新導航模式
  async updateNavigationMode(mode: ThemeMode): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.updateNavigationMode(mode);
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 切換特殊主題
  async toggleSpecialTheme(type: 'colorWeak' | 'greyTheme'): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.toggleSpecialTheme(type);
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 更新佈局設置
  async updateLayoutSetting(key: keyof ThemeSettings, value: boolean): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.updateLayoutSetting(key, value);
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 重置為默認設置
  async resetToDefault(): Promise<void> {
    const currentTheme = this._currentTheme$.value;
    if (!currentTheme) return;

    currentTheme.resetToDefault();
    await this.themeRepository.saveTheme(currentTheme);
    
    this._currentTheme$.next(currentTheme);
    this._isDarkTheme$.next(currentTheme.isDarkTheme);
    this._settings$.next(currentTheme.settings);
  }

  // 檢查是否為暗色主題
  isDarkTheme(): boolean {
    return this._isDarkTheme$.value;
  }

  // 獲取當前設置
  getCurrentSettings(): ThemeSettings | null {
    return this._settings$.value;
  }
} 