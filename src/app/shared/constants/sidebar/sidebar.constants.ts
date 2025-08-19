/**
 * @ai-context {
 *   "role": "Shared/Constant",
 *   "purpose": "側邊欄導航項目常數-定義應用導航結構",
 *   "constraints": ["常數不可變", "類型安全", "導航一致性"],
 *   "dependencies": ["SidebarItem"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 */

import { SidebarItem } from '../../interfaces/layout/sidebar.interface';

// 重新導出 SidebarItem 類型，方便其他文件使用
export type { SidebarItem };

// 自動生成 label 屬性，確保向後兼容
export const SIDEBAR_NAV_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    title: '儀表板',
    label: '儀表板',        // 明確設置 label
    route: '/dashboard',
    icon: 'dashboard'
  },
  {
    id: 'analytics',
    title: '分析',
    label: '分析',
    icon: 'analytics',
    route: '/analytics'
  },
  {
    id: 'assignment',
    title: '任務分配',
    label: '任務分配',
    icon: 'assignment',
    route: '/assignment'
  },
  {
    id: 'auth',
    title: '認證管理',
    label: '認證管理',
    icon: 'security',
    route: '/auth'
  },
  {
    id: 'user-management',
    title: '用戶管理',
    label: '用戶管理',
    icon: 'people',
    children: [
      {
        id: 'user-list',
        title: '用戶列表',
        label: '用戶列表',
        route: '/users',
        icon: 'list'
      },
      {
        id: 'user-create',
        title: '新增用戶',
        label: '新增用戶',
        route: '/users/create',
        icon: 'person_add'
      }
    ]
  },
  {
    id: 'people',
    title: '人員管理',
    label: '人員管理',
    icon: 'group',
    children: [
      {
        id: 'personnel',
        title: '人員管理',
        label: '人員管理',
        route: '/people/personnel',
        icon: 'person'
      },
      {
        id: 'attendance',
        title: '考勤管理',
        label: '考勤管理',
        route: '/people/attendance',
        icon: 'schedule'
      },
      {
        id: 'partners',
        title: '合作夥伴',
        label: '合作夥伴',
        route: '/people/partners',
        icon: 'handshake'
      },
      {
        id: 'state-machine',
        title: '狀態機',
        label: '狀態機',
        route: '/people/state-machine',
        icon: 'device_hub'
      }
    ]
  },
  {
    id: 'construction',
    title: '工程管理',
    label: '工程管理',
    icon: 'construction',
    children: [
      {
        id: 'projects',
        title: '專案管理',
        label: '專案管理',
        route: '/construction/projects',
        icon: 'folder'
      },
      {
        id: 'tasks',
        title: '任務管理',
        label: '任務管理',
        route: '/construction/tasks',
        icon: 'task'
      },
      {
        id: 'schedules',
        title: '排程管理',
        label: '排程管理',
        route: '/construction/schedules',
        icon: 'calendar_today'
      },
      {
        id: 'calendars',
        title: '日曆',
        label: '日曆',
        route: '/construction/calendars',
        icon: 'event'
      },
      {
        id: 'daily-reports',
        title: '日報',
        label: '日報',
        route: '/construction/daily-reports',
        icon: 'report'
      },
      {
        id: 'construction-reports',
        title: '工程報告',
        label: '工程報告',
        route: '/construction/construction-reports',
        icon: 'assessment'
      },
      {
        id: 'weather-reports',
        title: '天氣報告',
        label: '天氣報告',
        route: '/construction/weather-reports',
        icon: 'wb_sunny'
      },
      {
        id: 'log',
        title: '日誌',
        label: '日誌',
        route: '/construction/log',
        icon: 'history'
      }
    ]
  },
  {
    id: 'finance',
    title: '財務管理',
    label: '財務管理',
    icon: 'account_balance',
    children: [
      {
        id: 'budget',
        title: '預算管理',
        label: '預算管理',
        route: '/finance/budget',
        icon: 'account_balance_wallet'
      },
      {
        id: 'expenses',
        title: '費用管理',
        label: '費用管理',
        route: '/finance/expenses',
        icon: 'receipt'
      },
      {
        id: 'payments',
        title: '付款管理',
        label: '付款管理',
        route: '/finance/payments',
        icon: 'payment'
      },
      {
        id: 'financial-reports',
        title: '財務報告',
        label: '財務報告',
        route: '/finance/financial-reports',
        icon: 'assessment'
      }
    ]
  },
  {
    id: 'public',
    title: '公共頁面',
    label: '公共頁面',
    icon: 'public',
    children: [
      {
        id: 'about',
        title: '關於我們',
        label: '關於我們',
        route: '/public/about',
        icon: 'info'
      },
      {
        id: 'blog',
        title: '部落格',
        label: '部落格',
        route: '/public/blog',
        icon: 'article'
      },
      {
        id: 'cases',
        title: '案例展示',
        label: '案例展示',
        route: '/public/cases',
        icon: 'cases'
      },
      {
        id: 'contact',
        title: '聯絡我們',
        label: '聯絡我們',
        route: '/public/contact',
        icon: 'contact_support'
      },
      {
        id: 'jobs',
        title: '職缺資訊',
        label: '職缺資訊',
        route: '/public/jobs',
        icon: 'work'
      },
      {
        id: 'legal',
        title: '法律條款',
        label: '法律條款',
        route: '/public/legal',
        icon: 'gavel'
      }
    ]
  }
].map(item => ({
  ...item,
  label: item.label || item.title,  // 自動填充 label
  children: item.children?.map(child => ({
    ...child,
    label: child.label || child.title
  }))
}));

