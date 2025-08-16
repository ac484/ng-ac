/**
 * @fileoverview App Shell 介面定義 (App Shell Interface)
 * @description 定義 App Shell 的核心介面和類型
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Shared Layer Interface
 * - 職責：App Shell 介面定義
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 定義 App Shell 的狀態介面
 * - 支援主題和側邊欄狀態
 * - 提供服務介面定義
 * - 極簡主義設計
 */

export type Theme = 'light' | 'dark' | 'compact';
export type SidebarState = 'open' | 'closed' | 'collapsed';

export interface IAppShell {
  id: string;
  theme: Theme;
  sidebarState: SidebarState;
  isInitialized: boolean;
}

export interface IAppShellService {
  theme: Theme;
  sidebarState: SidebarState;
  isDarkTheme: boolean;
  isSidebarOpen: boolean;
  
  setTheme(theme: Theme): void;
  toggleTheme(): void;
  toggleSidebar(): void;
  setSidebarState(state: SidebarState): void;
}
