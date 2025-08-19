/**
 * @fileoverview Tab 工具函數檔案 (Tab Utility Functions)
 * @description 提供 Tab Navigation 系統的工具函數
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Tab Utilities
 * - 職責：Tab 工具函數
 * - 依賴：Tab 介面
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只包含 Tab 相關的工具函數，不包含業務邏輯
 * - 遵循極簡主義原則，只實現必要的功能
 * - 使用純函數設計，無副作用
 */

import { TabItem } from '../../interfaces/tab/tab.interface';

/**
 * 生成唯一的標籤頁 ID
 */
export const generateTabId = (): string => {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 檢查標籤頁是否存在
 */
export const hasTab = (tabs: TabItem[], id: string): boolean => {
  return tabs.some(tab => tab.id === id);
};

/**
 * 獲取標籤頁索引
 */
export const getTabIndex = (tabs: TabItem[], id: string): number => {
  return tabs.findIndex(tab => tab.id === id);
};

/**
 * 檢查是否達到最大標籤頁數量
 */
export const canAddTab = (tabs: TabItem[], maxTabs: number): boolean => {
  return tabs.length < maxTabs;
};
