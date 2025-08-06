import { Injectable, inject } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeConfig {
    name: string;
    key: string;
    primaryColor: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly settingsService = inject(SettingsService);

    private readonly availableThemes: ThemeConfig[] = [
        {
            name: '預設主題',
            key: 'default',
            primaryColor: '#1890ff',
            description: '使用預設的藍色主題'
        },
        {
            name: '深色主題',
            key: 'dark',
            primaryColor: '#177ddc',
            description: '深色模式，適合夜間使用'
        },
        {
            name: '綠色主題',
            key: 'green',
            primaryColor: '#52c41a',
            description: '清新的綠色主題'
        },
        {
            name: '紫色主題',
            key: 'purple',
            primaryColor: '#722ed1',
            description: '高貴的紫色主題'
        },
        {
            name: '橙色主題',
            key: 'orange',
            primaryColor: '#fa8c16',
            description: '溫暖的橙色主題'
        }
    ];

    private readonly currentThemeSubject = new BehaviorSubject<ThemeConfig>(
        this.getThemeByKey(this.getCurrentThemeKey())
    );

    public readonly currentTheme$ = this.currentThemeSubject.asObservable();

    constructor() {
        // 初始化時設置當前主題
        this.setTheme(this.getCurrentThemeKey());
    }

    /**
     * 獲取所有可用主題
     */
    getAvailableThemes(): ThemeConfig[] {
        return [...this.availableThemes];
    }

    /**
     * 獲取當前主題
     */
    getCurrentTheme(): ThemeConfig {
        return this.currentThemeSubject.value;
    }

    /**
     * 切換主題
     * @param themeKey 主題鍵值
     */
    setTheme(themeKey: string): void {
        const theme = this.getThemeByKey(themeKey);
        if (!theme) {
            console.warn(`主題 "${themeKey}" 不存在，使用預設主題`);
            themeKey = 'default';
        }

        // 保存主題設置到本地存儲
        localStorage.setItem('app-theme', themeKey);

        // 更新當前主題
        const selectedTheme = this.getThemeByKey(themeKey);
        this.currentThemeSubject.next(selectedTheme);

        // 應用主題到 DOM
        this.applyThemeToDOM(selectedTheme);
    }

    /**
     * 根據鍵值獲取主題配置
     */
    private getThemeByKey(key: string): ThemeConfig {
        return this.availableThemes.find(theme => theme.key === key) || this.availableThemes[0];
    }

    /**
     * 獲取當前主題鍵值
     */
    private getCurrentThemeKey(): string {
        return localStorage.getItem('app-theme') || 'default';
    }

    /**
     * 將主題應用到 DOM
     */
    private applyThemeToDOM(theme: ThemeConfig): void {
        // 移除所有現有的主題類
        document.body.classList.remove(...this.availableThemes.map(t => `theme-${t.key}`));

        // 添加新主題類
        document.body.classList.add(`theme-${theme.key}`);

        // 設置 CSS 變量
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);

        // 觸發主題變更事件
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    /**
     * 切換到下一個主題
     */
    cycleToNextTheme(): void {
        const currentIndex = this.availableThemes.findIndex(t => t.key === this.getCurrentTheme().key);
        const nextIndex = (currentIndex + 1) % this.availableThemes.length;
        this.setTheme(this.availableThemes[nextIndex].key);
    }

    /**
     * 切換到上一個主題
     */
    cycleToPreviousTheme(): void {
        const currentIndex = this.availableThemes.findIndex(t => t.key === this.getCurrentTheme().key);
        const prevIndex = currentIndex === 0 ? this.availableThemes.length - 1 : currentIndex - 1;
        this.setTheme(this.availableThemes[prevIndex].key);
    }

    /**
     * 重置為預設主題
     */
    resetToDefault(): void {
        this.setTheme('default');
    }
}
