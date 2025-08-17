/**
 * @fileoverview Sidebar 佈局契約定義，提供側欄導覽與配置接口
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by System Migration
 *
 * 📋 檔案性質：
 * • 類型：Shared Layer - Interface
 * • 依賴：無
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 介面檔案不得包含業務邏輯或外部副作用
 * • 佈局契約須獨立於具體 UI 實作
 *
 * @module LayoutContracts
 * @layer Shared
 * @context Layout - Sidebar
 * @see docs/0.FILE_HEADER_CONVENTION.md
 * @see docs/0.new-Tree.md
 *
 * @example
 * import { SidebarConfig, SidebarNavItem } from 'src/app/shared/interfaces/layout';
 * const items: SidebarNavItem[] = [{ id: 'home', label: 'Home', routerLink: '/app/home' }];
 */

export interface SidebarNavItem {
  /** 導航項 ID */
  id: string;
  /** 顯示文本 */
  label: string;
  /** 路由連結 */
  routerLink?: string;
  /** 圖示名稱 */
  icon?: string;
  /** 是否啟用高亮 */
  isActive?: boolean;
  /** 次級選單 */
  children?: SidebarNavItem[];
  /** 是否禁用 */
  disabled?: boolean;
}

export interface SidebarConfig {
  /** 側欄寬度 */
  width?: string;
  /** 是否固定 */
  fixed?: boolean;
  /** 顯示模式 */
  mode?: 'over' | 'push' | 'side';
  /** 是否禁用關閉 */
  disableClose?: boolean;
  /** 是否自動調整大小 */
  autosize?: boolean;
}


