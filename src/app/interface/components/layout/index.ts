/**
 * @fileoverview 佈局組件索引文件，統一導出所有佈局相關組件
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Components Index
 * • 依賴：所有佈局組件
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責組件的重新導出
 * • 不包含具體的組件實現
 *
 * @module LayoutComponents
 * @layer Interface
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

// 基礎佈局組件
export * from './footer';
export * from './header';

// 現代化佈局組件
export * from './app-shell-modern';
export * from './layout-flex';
export * from './layout-utils';
export * from './responsive-container';

/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "布局組件統一匯出-布局組件集中管理",
 *   "constraints": ["統一匯出", "無業務邏輯", "依賴管理"],
 *   "dependencies": ["SidebarComponent"],
 *   "security": "none",
 *   "lastmod": "2025-01-18"
 * }
 * @usage import { SidebarComponent } from '@interface/components/layout'
 * @see docs/architecture/interface.md
 */

export * from './sidebar/sidebar.component';

