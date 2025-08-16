/**
 * App Shell 介面定義
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

export interface IAppShell {
  id: string;
  isInitialized: boolean;
  isOnline: boolean;
  currentTheme: 'light' | 'dark';
  sidebarOpen: boolean;
}

export interface IAppShellService {
  initialize(): Promise<void>;
  getState(): IAppShell;
  toggleTheme(): void;
  toggleSidebar(): void;
  setOnlineStatus(isOnline: boolean): void;
}
