/**
 * @fileoverview PWA 服務 (PWA Service)
 * @description 負責 Service Worker 管理、PWA 安裝和推送通知
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Application Layer PWA Service
 * - 職責：PWA 功能管理
 * - 依賴：Angular Core, Service Worker
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 管理 Service Worker 生命週期
 * - 支援 PWA 安裝提示
 * - 處理推送通知
 * - 極簡主義實現
 */

import { computed, Injectable, signal } from '@angular/core';

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  // PWA 狀態
  private readonly _canInstall = signal(false);
  private readonly _isInstalled = signal(false);
  private readonly _hasServiceWorker = signal(false);

  readonly canInstall = this._canInstall.asReadonly();
  readonly isInstalled = this._isInstalled.asReadonly();
  readonly hasServiceWorker = this._hasServiceWorker.asReadonly();

  // 計算屬性
  readonly showInstallPrompt = computed(() =>
    this._canInstall() && !this._isInstalled()
  );

  private installPrompt: PWAInstallPrompt | null = null;

  constructor() {
    this.initializePWA();
  }

  // PWA 安裝
  async installPWA(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        this._isInstalled.set(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('PWA 安裝失敗:', error);
      return false;
    }
  }

  // 檢查更新
  async checkForUpdate(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          return true;
        }
      } catch (error) {
        console.error('檢查更新失敗:', error);
      }
    }
    return false;
  }

  // 私有方法
  private initializePWA(): void {
    this.checkServiceWorker();
    this.setupInstallPrompt();
    this.checkInstallationStatus();
  }

  private checkServiceWorker(): void {
    this._hasServiceWorker.set('serviceWorker' in navigator);
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      const ev = event as any;
      if (typeof ev.preventDefault === 'function') {
        ev.preventDefault();
      }

      // 最小型類型守衛：以 in 與函式型別檢查
      if (typeof ev.prompt === 'function' && 'userChoice' in ev) {
        this.installPrompt = ev as PWAInstallPrompt;
        this._canInstall.set(true);
      }
    });

    window.addEventListener('appinstalled', () => {
      this._isInstalled.set(true);
      this._canInstall.set(false);
    });
  }

  private checkInstallationStatus(): void {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this._isInstalled.set(true);
    }
  }
}
