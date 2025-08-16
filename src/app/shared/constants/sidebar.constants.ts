/**
 * @fileoverview 侧边栏常量定义 (Sidebar Constants)
 * @description 定义侧边栏相关的常量值，基於官方 Angular Material Sidenav API
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Constants
 * - 職責：侧边栏常量定义
 * - 依賴：侧边栏接口
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義侧边栏的默认配置和导航项
 * - 使用極簡主義設計，避免過度複雜化
 * - 基於官方 API 進行效能優化
 */

// 側邊欄導航項目常量
export const SIDEBAR_NAV_ITEMS = [
  { label: '儀表板', icon: 'dashboard', route: '/app/dashboard' },
  { label: '用戶管理', icon: 'people', route: '/app/users' }
];

// 側邊欄配置常量 - 極簡設計
export const SIDEBAR_CONFIG = {
  CACHE_KEY: 'sidebar-state',
  DEFAULT_OPENED: false
} as const;
