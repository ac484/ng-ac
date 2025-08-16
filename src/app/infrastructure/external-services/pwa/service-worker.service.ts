/**
 * @fileoverview Service Worker 服務 (Service Worker Service)
 * @description 負責 Service Worker 的註冊、更新和生命週期管理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer PWA Service
 * - 職責：Service Worker 管理
 * - 依賴：Angular Core, Service Worker API
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 管理 Service Worker 的完整生命週期
 * - 支援自動更新檢測
 * - 處理安裝和激活事件
 * - 極簡主義實現
 */

import { Injectable, signal, computed } from '@angular/core';

export interface ServiceWorkerUpdate {
  available: boolean;
  current: string;
  available: string;
}

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  // Service Worker 狀態
  private readonly _isRegistered = signal(false);
  private readonly _isUpdateAvailable = signal(false);
  private readonly _currentVersion = signal<string>('');

  readonly isRegistered = this._isRegistered.asReadonly();
  readonly isUpdateAvailable = this._isUpdateAvailable.asReadonly();
  readonly currentVersion = this._currentVersion.asReadonly();

  // 計算屬性
  readonly canUpdate = computed(() => 
    this._isRegistered() && this._isUpdateAvailable()
  );

  constructor() {
    this.initializeServiceWorker();
  }

  // 註冊 Service Worker
  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/ngsw-worker.js');
      this._isRegistered.set(true);
      this._currentVersion.set(registration.active?.scriptURL || '');
      
      this.setupUpdateListener(registration);
      return true;
    } catch (error) {
      console.error('Service Worker 註冊失敗:', error);
      return false;
    }
  }

  // 檢查更新
  async checkForUpdate(): Promise<boolean> {
    if (!this._isRegistered()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
      return false;
    } catch (error) {
      console.error('檢查更新失敗:', error);
      return false;
    }
  }

  // 應用更新
  async applyUpdate(): Promise<boolean> {
    if (!this._isUpdateAvailable()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('應用更新失敗:', error);
      return false;
    }
  }

  // 私有方法
  private initializeServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      this.register();
    }
  }

  private setupUpdateListener(registration: ServiceWorkerRegistration): void {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this._isUpdateAvailable.set(true);
          }
        });
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      this._isUpdateAvailable.set(false);
      window.location.reload();
    });
  }
}
