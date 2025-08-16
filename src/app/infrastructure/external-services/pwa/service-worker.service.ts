/**
 * Service Worker 服務
 * 負責管理 PWA 的 Service Worker 功能
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async register(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/ngsw-worker.js');
        console.log('Service Worker 註冊成功:', this.swRegistration);
        return this.swRegistration;
      } catch (error) {
        console.error('Service Worker 註冊失敗:', error);
        return null;
      }
    }
    return null;
  }

  async unregister(): Promise<boolean> {
    if (this.swRegistration) {
      try {
        await this.swRegistration.unregister();
        this.swRegistration = null;
        console.log('Service Worker 已註銷');
        return true;
      } catch (error) {
        console.error('Service Worker 註銷失敗:', error);
        return false;
      }
    }
    return false;
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.swRegistration;
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }
}
