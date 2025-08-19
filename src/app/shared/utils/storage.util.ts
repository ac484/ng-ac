/**
 * @fileoverview 存儲工具函數 (Storage Utility)
 * @description 提供極簡的 LocalStorage 操作函數
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Utility
 * - 職責：存儲操作工具
 * - 依賴：瀏覽器 LocalStorage API
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 極簡設計，只提供必要的存儲功能
 * - 無類別封裝，直接函數導出
 * - 外部只需引用就能輕易實現
 */

const PREFIX = 'ng-ac:';

export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage set failed:', error);
    }
  }
};
