/**
 * 離線狀態服務
 * 負責管理離線狀態和網路狀態監聽
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { computed, Injectable, signal } from '@angular/core';
import { IOfflineService, IOfflineStatus } from '../../../shared/interfaces/app-shell';

@Injectable({ providedIn: 'root' })
export class OfflineService implements IOfflineService {
  private readonly _status = signal<IOfflineStatus>({
    isOnline: navigator.onLine
  });

  readonly status = this._status.asReadonly();
  readonly isOnline = computed(() => this._status().isOnline);

  constructor() {
    this.setupEventListeners();
  }

  getStatus(): IOfflineStatus {
    return this._status();
  }

  onOnline(callback: () => void): void {
    window.addEventListener('online', callback);
  }

  onOffline(callback: () => void): void {
    window.addEventListener('offline', callback);
  }

  setOnlineStatus(isOnline: boolean): void {
    this._status.update(status => ({
      ...status,
      isOnline,
      lastUpdateTime: new Date()
    }));
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this._status.update(status => ({
        ...status,
        isOnline: true,
        lastOnlineTime: new Date()
      }));
    });

    window.addEventListener('offline', () => {
      this._status.update(status => ({
        ...status,
        isOnline: false
      }));
    });
  }
}
