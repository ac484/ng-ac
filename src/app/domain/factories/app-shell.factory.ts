/**
 * @fileoverview App Shell 工廠 (App Shell Factory)
 * @description App Shell 聚合根的工廠類，實現現代 DDD 工廠模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Domain Layer Factory
 * - 職責：App Shell 聚合根創建
 * - 依賴：AppShell, Theme, SidebarState, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../../shared/base/result/result';
import { SidebarState } from '../../shared/value-objects/sidebar-state.vo';
import { Theme } from '../../shared/value-objects/theme.vo';
import { AppShell, AppShellProps } from '../entities/app-shell/app-shell.aggregate';

export class AppShellFactory {
  /**
   * 創建默認的 AppShell
   */
  static createDefault(id: string): Result<AppShell> {
    const themeResult = Theme.create('light');
    const sidebarStateResult = SidebarState.create('open');

    const combinedResult = Result.combine([themeResult, sidebarStateResult]);
    if (combinedResult.isFailure) {
      return Result.fail(`Failed to create default AppShell: ${combinedResult.error()}`);
    }

    const props: AppShellProps = {
      id,
      theme: themeResult.value(),
      sidebarState: sidebarStateResult.value(),
      isInitialized: false
    };

    return AppShell.create(props);
  }

  /**
   * 創建暗色主題的 AppShell
   */
  static createDark(id: string): Result<AppShell> {
    const themeResult = Theme.create('dark');
    const sidebarStateResult = SidebarState.create('closed');

    const combinedResult = Result.combine([themeResult, sidebarStateResult]);
    if (combinedResult.isFailure) {
      return Result.fail(`Failed to create dark AppShell: ${combinedResult.error()}`);
    }

    const props: AppShellProps = {
      id,
      theme: themeResult.value(),
      sidebarState: sidebarStateResult.value(),
      isInitialized: false
    };

    return AppShell.create(props);
  }

  /**
   * 創建自動主題的 AppShell
   */
  static createAuto(id: string): Result<AppShell> {
    const themeResult = Theme.create('auto');
    const sidebarStateResult = SidebarState.create('open');

    const combinedResult = Result.combine([themeResult, sidebarStateResult]);
    if (combinedResult.isFailure) {
      return Result.fail(`Failed to create auto AppShell: ${combinedResult.error()}`);
    }

    const props: AppShellProps = {
      id,
      theme: themeResult.value(),
      sidebarState: sidebarStateResult.value(),
      isInitialized: false
    };

    return AppShell.create(props);
  }

  /**
   * 從現有數據重建 AppShell
   */
  static recreate(props: AppShellProps): Result<AppShell> {
    return AppShell.create(props);
  }

  /**
   * 創建已初始化的 AppShell
   */
  static createInitialized(id: string, theme: string, sidebarState: string): Result<AppShell> {
    const themeResult = Theme.create(theme);
    const sidebarStateResult = SidebarState.create(sidebarState);

    const combinedResult = Result.combine([themeResult, sidebarStateResult]);
    if (combinedResult.isFailure) {
      return Result.fail(`Failed to create initialized AppShell: ${combinedResult.error()}`);
    }

    const props: AppShellProps = {
      id,
      theme: themeResult.value(),
      sidebarState: sidebarStateResult.value(),
      isInitialized: true
    };

    return AppShell.create(props);
  }
}

