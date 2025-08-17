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
  // 🏗️ 現場管理
  {
    label: '現場管理',
    icon: 'construction',
    children: [
      { label: '行事曆', route: '/app/calendars' },
      { label: '排程管理', route: '/app/schedules' },
      { label: '任務管理', route: '/app/task' },
      { label: '每日報告', route: '/app/daily-reports' },
      { label: '施工報告', route: '/app/construction-reports' },
      { label: '天氣報告', route: '/app/weather-reports' },
      { label: '工程日誌', route: '/app/log' }
    ]
  },
  // 📋 專案管理
  {
    label: '專案管理',
    icon: 'assignment',
    children: [
      { label: '合約管理', route: '/app/contract' },
      { label: '材料庫存', route: '/app/inventory' },
      { label: '設備管理', route: '/app/equipment' },
      { label: '品質控制', route: '/app/quality-control' },
      { label: '文件管理', route: '/app/documents' }
    ]
  },
    // 👥 人員管理
  {
    label: '人員管理',
    icon: 'people',
    children: [
      { label: '員工管理', route: '/app/personnel' },
      { label: '用戶管理', route: '/app/users' },
      { label: '出勤管理', route: '/app/attendance' },
      { label: '合作夥伴', route: '/app/partners' }
    ]
  },
  // ⚠️ 安全監控
  {
    label: '安全監控',
    icon: 'security',
    children: [
      { label: '安全管理', route: '/app/safety' },
      { label: '系統監控', route: '/app/monitoring' },
      { label: '資安管理', route: '/app/security' },
      { label: '事故報告', route: '/app/incident-reports' }
    ]
  },
  // 💰 財務管理
  {
    label: '財務管理',
    icon: 'finance',
    children: [
      { label: '預算管理', route: '/app/budget' },
      { label: '費用管控', route: '/app/expenses' },
      { label: '付款管理', route: '/app/payments' },
      { label: '財務報表', route: '/app/financial-reports' }
    ]
  },
  // 📊 數據分析
  {
    label: '數據分析',
    icon: 'analytics',
    children: [
      { label: '專案分析', route: '/app/analytics/projects' },
      { label: '績效分析', route: '/app/analytics/performance' },
      { label: '成本分析', route: '/app/analytics/costs' },
      { label: '統計報表', route: '/app/analytics/reports' }
    ]
  },
  // 🤝 夥伴
  {
    label: '夥伴',
    icon: 'partner',
    children: [
      { label: '夥伴', route: '/app/partners' }
    ]
  },
  // ⚙️ 系統設定
  {
    label: '系統設定',
    icon: 'settings',
    children: [
      { label: '系統設定', route: '/app/settings/system' },
      { label: '權限管理', route: '/app/settings/permissions' },
      { label: '通知設定', route: '/app/settings/notifications' },
      { label: '備份還原', route: '/app/settings/backup' }
    ]
  },
  {
    label: '公開資訊',
    icon: 'public',
    children: [
      { label: '關於我們', route: '/app/public/about' },
      { label: '成功案例', route: '/app/public/cases' },
      { label: '職缺招聘', route: '/app/public/jobs' },
      { label: '部落格', route: '/app/public/blog' },
      { label: '聯繫我們', route: '/app/public/contact' },
      { label: '法律條款', route: '/app/public/legal' }
    ]
  }
];

// 側邊欄配置常量 - 極簡設計
export const SIDEBAR_CONFIG = {
  CACHE_KEY: 'sidebar-state',
  DEFAULT_OPENED: false
} as const;
