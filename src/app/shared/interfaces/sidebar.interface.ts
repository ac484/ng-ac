/**
 * @fileoverview 侧边栏接口定义 (Sidebar Interface Definitions)
 * @description 定义侧边栏相关的接口和类型
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Interface
 * - 職責：侧边栏接口定义
 * - 依賴：Angular Core
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案定義侧边栏的基本接口
 * - 使用極簡主義設計，避免過度複雜化
 */

export interface SidebarNavItem {
  /** 导航项ID */
  id: string;
  /** 显示文本 */
  label: string;
  /** 路由链接 */
  routerLink?: string;
  /** 图标名称 */
  icon?: string;
  /** 是否激活 */
  isActive?: boolean;
  /** 子菜单项 */
  children?: SidebarNavItem[];
  /** 是否禁用 */
  disabled?: boolean;
}

export interface SidebarConfig {
  /** 侧边栏宽度 */
  width?: string;
  /** 是否固定 */
  fixed?: boolean;
  /** 显示模式 */
  mode?: 'over' | 'push' | 'side';
  /** 是否禁用关闭 */
  disableClose?: boolean;
  /** 是否自动调整大小 */
  autosize?: boolean;
}
