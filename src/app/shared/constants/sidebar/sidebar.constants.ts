/**
 * @fileoverview 側邊欄常數 (Sidebar Constants)
 * @description 側邊欄相關的常數定義 - 已簡化，僅保留基本結構
 * @author NG-AC Team
 * @version 2.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Shared Layer Constants
 * - 職責：側邊欄常數定義（已簡化）
 * - 依賴：SidebarItem 接口
 * - 狀態：已簡化，不再使用
 */

import { SidebarItem } from '../../interfaces/layout/sidebar.interface';

// 重新導出 SidebarItem 類型，方便其他文件使用
export type { SidebarItem };

// 簡化的側邊欄導航項目（僅供參考，實際使用已移至其他位置）
export const SIDEBAR_NAV_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    title: '儀表板',
    label: '儀表板',
    route: '/dashboard',
    icon: 'dashboard'
  }
];

// 導出空數組，表示此常數文件已不再使用
export const EMPTY_SIDEBAR_ITEMS: SidebarItem[] = [];

