import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../application/theme/theme.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitService {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);

  async initializeTheme(): Promise<void> {
    try {
      // 等待主題服務初始化
      await this.waitForThemeService();
      
      // 獲取當前主題設置
      const settings = this.themeService.getCurrentSettings();
      if (settings) {
        // 應用主題到 DOM
        this.applyThemeToDOM(settings);
      }
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  }

  private async waitForThemeService(): Promise<void> {
    return new Promise((resolve) => {
      const checkService = () => {
        if (this.themeService.getCurrentSettings()) {
          resolve();
        } else {
          setTimeout(checkService, 10);
        }
      };
      checkService();
    });
  }

  private applyThemeToDOM(settings: any): void {
    const htmlElement = this.document.documentElement;

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