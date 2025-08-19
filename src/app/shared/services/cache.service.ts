/**
 * @ai-context {
 *   "role": "Shared/Service",
 *   "purpose": "統一緩存管理服務-本地存儲與Signals整合",
 *   "constraints": ["Signals優先", "無外部依賴", "類型安全", "極簡主義"],
 *   "dependencies": ["@angular/core"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 * @usage cacheService.set('key', value), cacheService.get('key')
 * @see docs/01-angular20-architecture.md
 */
import { computed, Injectable, signal } from '@angular/core';

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly PREFIX = 'ng-ac-cache:';

  // 緩存統計 Signals
  private readonly _cacheStats = signal({
    totalItems: 0,
    totalSize: 0,
    lastCleanup: Date.now()
  });

  readonly cacheStats = this._cacheStats.asReadonly();
  readonly isCacheEmpty = computed(() => this._cacheStats().totalItems === 0);

  /**
   * 設置緩存
   */
  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const fullKey = this.PREFIX + key;
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl
      };

      localStorage.setItem(fullKey, JSON.stringify(item));
      this.updateStats();
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

      if (!item) return defaultValue ?? null;

      const cacheItem: CacheItem<T> = JSON.parse(item);

      // 檢查 TTL
      if (cacheItem.ttl && Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        this.remove(key);
        return defaultValue ?? null;
      }

      return cacheItem.value;
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
      this.updateStats();
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
      this.updateStats();
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

  /**
   * 清理過期緩存
   */
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
      let cleanedCount = 0;

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (cacheItem.ttl && Date.now() - cacheItem.timestamp > cacheItem.ttl) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch (error) {
          // 移除損壞的緩存項目
          localStorage.removeItem(key);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        this.updateStats();
        console.log(`Cleaned up ${cleanedCount} expired cache items`);
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  private updateStats(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
      const totalSize = keys.reduce((size, key) => {
        const item = localStorage.getItem(key);
        return size + (item ? new Blob([item]).size : 0);
      }, 0);

      this._cacheStats.set({
        totalItems: keys.length,
        totalSize,
        lastCleanup: Date.now()
      });
    } catch (error) {
      console.warn('Failed to update cache stats:', error);
    }
  }
}
