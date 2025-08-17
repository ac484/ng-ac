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

export type SidebarItem = {
  label: string;
  icon?: string;
  route?: string;
  children?: Array<{ label: string; route: string }>
};

export const SIDEBAR_NAV_ITEMS: SidebarItem[] = [
  { label: '儀表板', icon: 'dashboard', route: '/app/dashboard' },
  { label: '用戶管理', icon: 'people', route: '/app/users' },
  { label: '監控', icon: 'monitor_heart', route: '/app/monitoring' },
  { label: '安全', icon: 'security', route: '/app/security' },
  {
    label: '公開資訊',
    icon: 'public',
    children: [
      { label: '關於', route: '/app/public/about' },
      { label: '部落格', route: '/app/public/blog' },
      { label: '職缺', route: '/app/public/jobs' },
      { label: '案例', route: '/app/public/cases' },
      { label: '聯繫我們', route: '/app/public/contact' },
      { label: '法律', route: '/app/public/legal' }
    ]
  }
];

// 側邊欄配置常量 - 極簡設計
export const SIDEBAR_CONFIG = {
  CACHE_KEY: 'sidebar-state',
  DEFAULT_OPENED: false
} as const;
