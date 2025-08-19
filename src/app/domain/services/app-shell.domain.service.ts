/**
 * @fileoverview App Shell 領域服務 (App Shell Domain Service)
 * @description App Shell 聚合根的領域服務，實現複雜業務邏輯封裝
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Domain Layer Service
 * - 職責：App Shell 複雜業務邏輯封裝
 * - 依賴：AppShell, AppShellRepository, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../../shared/base/result/result';
import { SidebarState } from '../../shared/value-objects/sidebar-state.vo';
import { Theme } from '../../shared/value-objects/theme.vo';
import { AppShell } from '../entities/app-shell/app-shell.aggregate';
import { AppShellRepository } from '../repositories/app-shell.repository';

export class AppShellDomainService {
  constructor(private readonly appShellRepository: AppShellRepository) {}

  /**
   * 檢查用戶是否可以更改主題
   */
  canChangeTheme(appShell: AppShell): boolean {
    return appShell.isInitialized && appShell.canChangeTheme();
  }

  /**
   * 檢查用戶是否可以切換側邊欄
   */
  canToggleSidebar(appShell: AppShell): boolean {
    return appShell.isInitialized && appShell.canToggleSidebar();
  }

  /**
   * 更改主題（包含業務規則驗證）
   */
  async changeTheme(appShellId: string, newThemeValue: string): Promise<Result<AppShell>> {
    // 查找現有的 AppShell
    const findResult = await this.appShellRepository.findById(appShellId);
    if (findResult.isFailure) {
      return Result.fail(`AppShell not found: ${findResult.error()}`);
    }

    const appShell = findResult.value();

    // 檢查是否可以更改主題
    if (!this.canChangeTheme(appShell)) {
      return Result.fail('Cannot change theme: AppShell not initialized or change not allowed');
    }

    // 創建新的主題值物件
    const themeResult = Theme.create(newThemeValue);
    if (themeResult.isFailure) {
      return Result.fail(`Invalid theme value: ${themeResult.error()}`);
    }

    // 更改主題
    const changeResult = appShell.setTheme(themeResult.value());
    if (changeResult.isFailure) {
      return Result.fail(`Failed to change theme: ${changeResult.error()}`);
    }

    const updatedAppShell = changeResult.value();

    // 保存更改
    const saveResult = await this.appShellRepository.save(updatedAppShell);
    if (saveResult.isFailure) {
      return Result.fail(`Failed to save AppShell: ${saveResult.error()}`);
    }

    return Result.ok(updatedAppShell);
  }

  /**
   * 切換側邊欄狀態（包含業務規則驗證）
   */
  async toggleSidebar(appShellId: string): Promise<Result<AppShell>> {
    // 查找現有的 AppShell
    const findResult = await this.appShellRepository.findById(appShellId);
    if (findResult.isFailure) {
      return Result.fail(`AppShell not found: ${findResult.error()}`);
    }

    const appShell = findResult.value();

    // 檢查是否可以切換側邊欄
    if (!this.canToggleSidebar(appShell)) {
      return Result.fail('Cannot toggle sidebar: AppShell not initialized or toggle not allowed');
    }

    // 切換側邊欄狀態
    const newState = appShell.sidebarState.isOpen() ? 'closed' : 'open';
    const sidebarStateResult = SidebarState.create(newState);
    if (sidebarStateResult.isFailure) {
      return Result.fail(`Failed to create sidebar state: ${sidebarStateResult.error()}`);
    }

    const changeResult = appShell.setSidebarState(sidebarStateResult.value());
    if (changeResult.isFailure) {
      return Result.fail(`Failed to change sidebar state: ${changeResult.error()}`);
    }

    const updatedAppShell = changeResult.value();

    // 保存更改
    const saveResult = await this.appShellRepository.save(updatedAppShell);
    if (saveResult.isFailure) {
      return Result.fail(`Failed to save AppShell: ${saveResult.error()}`);
    }

    return Result.ok(updatedAppShell);
  }

  /**
   * 初始化 AppShell（包含業務規則驗證）
   */
  async initializeAppShell(appShellId: string): Promise<Result<AppShell>> {
    // 查找現有的 AppShell
    const findResult = await this.appShellRepository.findById(appShellId);
    if (findResult.isFailure) {
      return Result.fail(`AppShell not found: ${findResult.error()}`);
    }

    const appShell = findResult.value();

    // 檢查是否已經初始化
    if (appShell.isInitialized) {
      return Result.fail('AppShell already initialized');
    }

    // 初始化 AppShell
    const initResult = appShell.initialize();
    if (initResult.isFailure) {
      return Result.fail(`Failed to initialize AppShell: ${initResult.error()}`);
    }

    const initializedAppShell = initResult.value();

    // 保存更改
    const saveResult = await this.appShellRepository.save(initializedAppShell);
    if (saveResult.isFailure) {
      return Result.fail(`Failed to save initialized AppShell: ${saveResult.error()}`);
    }

    return Result.ok(initializedAppShell);
  }

  /**
   * 檢查 AppShell 的健康狀態
   */
  async checkAppShellHealth(appShellId: string): Promise<Result<AppShellHealthStatus>> {
    // 查找現有的 AppShell
    const findResult = await this.appShellRepository.findById(appShellId);
    if (findResult.isFailure) {
      return Result.fail(`AppShell not found: ${findResult.error()}`);
    }

    const appShell = findResult.value();

    const healthStatus: AppShellHealthStatus = {
      isHealthy: appShell.isValid(),
      isInitialized: appShell.isInitialized,
      canChangeTheme: this.canChangeTheme(appShell),
      canToggleSidebar: this.canToggleSidebar(appShell),
      theme: appShell.theme.value,
      sidebarState: appShell.sidebarState.value,
      eventCount: appShell.eventCount
    };

    return Result.ok(healthStatus);
  }
}

export interface AppShellHealthStatus {
  isHealthy: boolean;
  isInitialized: boolean;
  canChangeTheme: boolean;
  canToggleSidebar: boolean;
  theme: string;
  sidebarState: string;
  eventCount: number;
}

