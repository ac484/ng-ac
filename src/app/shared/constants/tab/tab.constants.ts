/**
 * @fileoverview Tab 常量定義檔案 (Tab Constants Definition)
 * @description 定義 Tab Navigation 系統的常量
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Tab Constants
 * - 職責：Tab 常量定義
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只定義 Tab 相關的常量，不包含業務邏輯
 * - 遵循極簡主義原則，只定義必要的常量
 * - 使用官方 Angular Material Tabs API 規範
 */

export const TAB_CONFIG = {
  /** 標籤頁緩存鍵 */
  CACHE_KEY: 'tab-navigation-state',
  
  /** 最大標籤頁數量 */
  MAX_TABS: 10,
  
  /** 標籤頁動畫持續時間 */
  ANIMATION_DURATION: '300ms',
  
  /** 標籤頁預設寬度 */
  TAB_WIDTH: 200
} as const;

export const TAB_ICONS = {
  /** 關閉圖標 */
  CLOSE: 'close',
  
  /** 儀表板圖標 */
  DASHBOARD: 'dashboard',
  
  /** 用戶圖標 */
  USER: 'person',
  
  /** 設置圖標 */
  SETTINGS: 'settings'
} as const;
