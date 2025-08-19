/**
 * @fileoverview App Shell 實體 (App Shell Entity)
 * @description 定義 App Shell 的領域實體和業務邏輯
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Domain Layer Entity
 * - 職責：App Shell 業務邏輯
 * - 依賴：Base Entity, Shared Layer
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 繼承基礎實體類別
 * - 包含 App Shell 的業務規則
 * - 支援主題和側邊欄狀態管理
 * - 極簡主義實現
 */

import { BaseEntity } from '../../../shared/base/entities/base.entity';
import { SidebarState, Theme } from '../../../shared/interfaces/app-shell';

export class AppShell extends BaseEntity {
  constructor(
    id: string,
    public theme: Theme = 'light',
    public sidebarState: SidebarState = 'open',
    public isInitialized: boolean = false
  ) {
    super(id);
  }

  // 業務邏輯方法
  canToggleSidebar(): boolean {
    return this.isInitialized;
  }

  canChangeTheme(): boolean {
    return this.isInitialized;
  }

  // 狀態變更方法
  setTheme(theme: Theme): void {
    if (this.canChangeTheme()) {
      this.theme = theme;
      this.markAsModified();
    }
  }

  setSidebarState(state: SidebarState): void {
    if (this.canToggleSidebar()) {
      this.sidebarState = state;
      this.markAsModified();
    }
  }

  // 驗證方法
  isValid(): boolean {
    return this.id.length > 0 && this.isInitialized;
  }
}
