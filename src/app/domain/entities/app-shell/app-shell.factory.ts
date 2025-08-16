/**
 * @fileoverview App Shell 工廠 (App Shell Factory)
 * @description 負責創建和配置 App Shell 實體
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Domain Layer Factory
 * - 職責：App Shell 實體創建
 * - 依賴：App Shell Entity
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 提供標準的 App Shell 創建方法
 * - 支援預設配置和自訂配置
 * - 確保實體的正確初始化
 * - 極簡主義實現
 */

import { AppShell } from './app-shell.entity';
import { Theme, SidebarState } from '../../../shared/interfaces/app-shell';

export class AppShellFactory {
  static createDefault(id: string): AppShell {
    return new AppShell(id, 'light', 'open', false);
  }

  static createWithTheme(id: string, theme: Theme): AppShell {
    return new AppShell(id, theme, 'open', false);
  }

  static createWithSidebar(id: string, sidebarState: SidebarState): AppShell {
    return new AppShell(id, 'light', sidebarState, false);
  }

  static createFull(id: string, theme: Theme, sidebarState: SidebarState): AppShell {
    return new AppShell(id, theme, sidebarState, false);
  }

  static createInitialized(id: string): AppShell {
    return new AppShell(id, 'light', 'open', true);
  }
}
