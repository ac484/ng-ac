/**
 * @fileoverview Material主題服務 (Material Theme Service)
 * @description 提供Material Design主題相關的服務功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Material Service
 * - 職責：Material主題服務管理
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供最精簡的Material主題服務
 * - 採用極簡主義設計，避免過度複雜化
 * - 支持亮色和暗色主題切換
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialThemeService {

  private readonly THEME_KEY = 'ng-ac-theme';
  private readonly defaultTheme: ThemeConfig = {
    mode: 'light',
    primaryColor: '#3f51b5',
    accentColor: '#ff4081'
  };

  private themeSubject = new BehaviorSubject<ThemeConfig>(this.loadTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  /**
   * 獲取當前主題配置
   */
  getCurrentTheme(): ThemeConfig {
    return this.themeSubject.value;
  }

  /**
   * 切換主題模式
   */
  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newMode: ThemeMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    this.setThemeMode(newMode);
  }

  /**
   * 設置主題模式
   */
  setThemeMode(mode: ThemeMode): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, mode };
    this.updateTheme(newTheme);
  }

  /**
   * 設置主色調
   */
  setPrimaryColor(color: string): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, primaryColor: color };
    this.updateTheme(newTheme);
  }

  /**
   * 設置強調色調
   */
  setAccentColor(color: string): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeConfig = { ...currentTheme, accentColor: color };
    this.updateTheme(newTheme);
  }

  /**
   * 重置為默認主題
   */
  resetToDefault(): void {
    this.updateTheme(this.defaultTheme);
  }

  /**
   * 更新主題配置
   */
  private updateTheme(theme: ThemeConfig): void {
    this.themeSubject.next(theme);
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * 應用主題到DOM
   */
  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;

    // 設置主題模式
    root.setAttribute('data-theme', theme.mode);

    // 設置CSS變量
    root.style.setProperty('--mat-primary-color', theme.primaryColor);
    root.style.setProperty('--mat-accent-color', theme.accentColor);

    // 設置color-scheme
    root.style.setProperty('color-scheme', theme.mode);
  }

  /**
   * 從localStorage加載主題
   */
  private loadTheme(): ThemeConfig {
    try {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (savedTheme) {
        return JSON.parse(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return this.defaultTheme;
  }

  /**
   * 保存主題到localStorage
   */
  private saveTheme(theme: ThemeConfig): void {
    try {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }
}
