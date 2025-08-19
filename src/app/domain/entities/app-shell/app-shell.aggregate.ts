/**
 * @fileoverview App Shell 聚合根 (App Shell Aggregate)
 * @description 定義 App Shell 的聚合根，實現現代 DDD 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Domain Layer Aggregate
 * - 職責：App Shell 聚合根業務邏輯
 * - 依賴：BaseAggregate, Theme, SidebarState, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 使用現代 DDD 聚合根模式
 * - 包含 App Shell 的業務規則
 * - 支援主題和側邊欄狀態管理
 * - 實現領域事件
 */

import { BaseAggregate } from '../../../shared/base/aggregates/base-aggregate';
import { Result } from '../../../shared/base/result/result';
import { SidebarState } from '../../../shared/value-objects/sidebar-state.vo';
import { Theme } from '../../../shared/value-objects/theme.vo';

export interface AppShellProps {
  id: string;
  theme: Theme;
  sidebarState: SidebarState;
  isInitialized: boolean;
}

export class AppShell extends BaseAggregate<AppShellProps> {
  private constructor(props: AppShellProps) {
    super(props);
  }

  /**
   * 靜態工廠方法
   */
  static create(props: AppShellProps): Result<AppShell> {
    if (!AppShell.isValidProps(props)) {
      return Result.fail('Invalid AppShell properties');
    }
    return Result.ok(new AppShell(props));
  }

  /**
   * 驗證屬性
   */
  static isValidProps(props: any): props is AppShellProps {
    return props &&
           typeof props.id === 'string' &&
           props.id.length > 0 &&
           props.theme instanceof Theme &&
           props.sidebarState instanceof SidebarState &&
           typeof props.isInitialized === 'boolean';
  }

  /**
   * 創建默認 AppShell
   */
  static createDefault(id: string): Result<AppShell> {
    const themeResult = Theme.create('light');
    const sidebarStateResult = SidebarState.create('open');

    const combinedResult = Result.combine([themeResult, sidebarStateResult]);
    if (combinedResult.isFailure) {
      return Result.fail(combinedResult.error());
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
   * 獲取主題
   */
  get theme(): Theme {
    return this.props.theme;
  }

  /**
   * 獲取側邊欄狀態
   */
  get sidebarState(): SidebarState {
    return this.props.sidebarState;
  }

  /**
   * 獲取初始化狀態
   */
  get isInitialized(): boolean {
    return this.props.isInitialized;
  }

  /**
   * 業務邏輯方法
   */
  canToggleSidebar(): boolean {
    return this.isInitialized;
  }

  canChangeTheme(): boolean {
    return this.isInitialized;
  }

  /**
   * 狀態變更方法（返回新的實例）
   */
  setTheme(theme: Theme): Result<AppShell> {
    if (!this.canChangeTheme()) {
      return Result.fail('Cannot change theme: AppShell not initialized');
    }

    const newProps: AppShellProps = {
      ...this.props,
      theme
    };

    const newAppShell = AppShell.create(newProps);
    if (newAppShell.isSuccess) {
      newAppShell.value().addEvent('THEME_CHANGED', {
        oldTheme: this.theme.value,
        newTheme: theme.value
      });
    }

    return newAppShell;
  }

  setSidebarState(state: SidebarState): Result<AppShell> {
    if (!this.canToggleSidebar()) {
      return Result.fail('Cannot toggle sidebar: AppShell not initialized');
    }

    const newProps: AppShellProps = {
      ...this.props,
      sidebarState: state
    };

    const newAppShell = AppShell.create(newProps);
    if (newAppShell.isSuccess) {
      newAppShell.value().addEvent('SIDEBAR_STATE_CHANGED', {
        oldState: this.sidebarState.value,
        newState: state.value
      });
    }

    return newAppShell;
  }

  /**
   * 初始化 AppShell
   */
  initialize(): Result<AppShell> {
    if (this.isInitialized) {
      return Result.fail('AppShell already initialized');
    }

    const newProps: AppShellProps = {
      ...this.props,
      isInitialized: true
    };

    const newAppShell = AppShell.create(newProps);
    if (newAppShell.isSuccess) {
      newAppShell.value().addEvent('APPSHELL_INITIALIZED', {
        timestamp: new Date()
      });
    }

    return newAppShell;
  }

  /**
   * 驗證方法
   */
  isValid(): boolean {
    return this.id.length > 0 && this.isInitialized;
  }
}

