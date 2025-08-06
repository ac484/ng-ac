import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme, ThemeSettings } from '../../domain/theme/theme.entity';
import { ThemeRepository } from '../../domain/theme/theme.repository';

const THEME_STORAGE_KEY = 'ng-ac-theme-settings';
const IS_NIGHT_KEY = 'ng-ac-is-night-theme';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageThemeRepository implements ThemeRepository {
    private readonly document = inject(DOCUMENT);

    async getCurrentTheme(): Promise<Theme> {
        try {
            // 嘗試從 localStorage 獲取設置
            const storedSettings = localStorage.getItem(THEME_STORAGE_KEY);
            const isNightTheme = localStorage.getItem(IS_NIGHT_KEY) === 'true';

            if (storedSettings) {
                const settings: ThemeSettings = JSON.parse(storedSettings);
                // 確保暗色主題狀態同步
                if (isNightTheme) {
                    settings.theme = 'dark';
                }
                return new Theme(settings);
            }

            // 如果沒有存儲的設置，檢查系統偏好
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultSettings: Partial<ThemeSettings> = {
                theme: prefersDark ? 'dark' : 'light'
            };

            return new Theme(defaultSettings);
        } catch (error) {
            console.error('Failed to load theme from storage:', error);
            return new Theme();
        }
    }

    async saveTheme(theme: Theme): Promise<void> {
        try {
            const settings = theme.settings;
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
            localStorage.setItem(IS_NIGHT_KEY, theme.isDarkTheme.toString());

            // 應用主題到 DOM
            this.applyThemeToDOM(theme);
        } catch (error) {
            console.error('Failed to save theme to storage:', error);
            throw error;
        }
    }

    async deleteTheme(): Promise<void> {
        try {
            localStorage.removeItem(THEME_STORAGE_KEY);
            localStorage.removeItem(IS_NIGHT_KEY);
        } catch (error) {
            console.error('Failed to delete theme from storage:', error);
            throw error;
        }
    }

    private applyThemeToDOM(theme: Theme): void {
        const htmlElement = this.document.documentElement;
        const settings = theme.settings;

        // 移除舊的主題類
        htmlElement.classList.remove('light', 'dark');

        // 添加新的主題類
        htmlElement.classList.add(settings.theme);

        // 應用特殊主題
        if (settings.colorWeak) {
            htmlElement.classList.add('color-weak');
        } else {
            htmlElement.classList.remove('color-weak');
        }

        if (settings.greyTheme) {
            htmlElement.classList.add('grey-theme');
        } else {
            htmlElement.classList.remove('grey-theme');
        }

        // 設置主色調 CSS 變量
        htmlElement.style.setProperty('--primary-color', settings.color);
    }
} 