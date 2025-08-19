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

