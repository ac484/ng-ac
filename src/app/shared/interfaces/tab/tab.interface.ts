/**
 * @fileoverview Tab 介面定義檔案 (Tab Interface Definition)
 * @description 定義 Tab Navigation 系統的核心介面
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Tab Interface
 * - 職責：Tab 介面定義
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只定義 Tab 相關的介面，不包含實現邏輯
 * - 遵循極簡主義原則，只定義必要的屬性
 * - 使用官方 Angular Material Tabs API 規範
 */

export interface TabItem {
  /** 標籤頁唯一標識符 */
  id: string;
  
  /** 標籤頁顯示標籤 */
  label: string;
  
  /** 標籤頁路由路徑 */
  route: string;
  
  /** 標籤頁圖標（可選） */
  icon?: string;
  
  /** 是否可關閉 */
  closable: boolean;
  
  /** 標籤頁組件（可選） */
  component?: any;
  
  /** 傳遞給組件的數據（可選） */
  data?: any;
}

export interface TabChangeEvent {
  /** 當前選中的標籤頁索引 */
  index: number;
  
  /** 當前選中的標籤頁 */
  tab: TabItem;
}
