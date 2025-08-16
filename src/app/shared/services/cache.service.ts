/**
 * @fileoverview 緩存服務 (Cache Service)
 * @description 提供簡單高效的瀏覽器緩存功能，使用 LocalStorage 實現
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Service
 * - 職責：緩存管理服務
 * - 依賴：瀏覽器 LocalStorage API
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 使用 LocalStorage 實現，無外部依賴
 * - 支援 TypeScript 泛型，類型安全
 * - 模組化設計，高度自有
 * - 外部只需引用就能輕易實現
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly PREFIX = 'ng-ac-cache:';

  /**
   * 設置緩存
   */
  set<T>(key: string, value: T): void {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  /**
   * 獲取緩存
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const fullKey = this.PREFIX + key;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * 刪除緩存
   */
  remove(key: string): void {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.warn('Cache remove failed:', error);
    }
  }

  /**
   * 清空所有緩存
   */
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }

  /**
   * 檢查緩存是否存在
   */
  has(key: string): boolean {
    try {
      const fullKey = this.PREFIX + key;
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      return false;
    }
  }
}
