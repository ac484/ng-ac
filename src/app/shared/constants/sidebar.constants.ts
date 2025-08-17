/**
 * @fileoverview 側邊欄常量定義檔案 (Sidebar Constants Definition)
 * @description 定義側邊欄組件的常量
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Sidebar Constants
 * - 職責：側邊欄常量定義
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只定義側邊欄相關的常量，不包含業務邏輯
 * - 遵循極簡主義原則，只定義必要的常量
 * - 使用官方 Angular Material Sidenav API 規範
 */

export const SIDEBAR_NAV_ITEMS = [
  { label: '儀表板', icon: 'dashboard', route: '/app/dashboard' },
  { label: '用戶管理', icon: 'people', route: '/app/users' }
];

// 側邊欄配置常量 - 極簡設計
export const SIDEBAR_CONFIG = {
  CACHE_KEY: 'sidebar-state',
  DEFAULT_OPENED: false
} as const;
