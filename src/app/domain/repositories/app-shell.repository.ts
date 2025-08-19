/**
 * @fileoverview App Shell 倉儲接口 (App Shell Repository Interface)
 * @description App Shell 聚合根的倉儲接口，實現現代 DDD 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Domain Layer Repository Interface
 * - 職責：App Shell 聚合根數據訪問抽象
 * - 依賴：AppShell, Result
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

import { Result } from '../../shared/base/result/result';
import { AppShell } from '../entities/app-shell/app-shell.aggregate';

export interface AppShellRepository {
  /**
   * 根據 ID 查找 AppShell
   */
  findById(id: string): Promise<Result<AppShell>>;

  /**
   * 保存 AppShell
   */
  save(appShell: AppShell): Promise<Result<void>>;

  /**
   * 刪除 AppShell
   */
  delete(id: string): Promise<Result<void>>;

  /**
   * 檢查 AppShell 是否存在
   */
  exists(id: string): Promise<Result<boolean>>;

  /**
   * 獲取所有 AppShell
   */
  findAll(): Promise<Result<AppShell[]>>;

  /**
   * 根據條件查找 AppShell
   */
  findByCriteria(criteria: AppShellCriteria): Promise<Result<AppShell[]>>;
}

export interface AppShellCriteria {
  isInitialized?: boolean;
  theme?: string;
  sidebarState?: string;
}

