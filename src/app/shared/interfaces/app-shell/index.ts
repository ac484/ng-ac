/**
 * @fileoverview App Shell 介面統一導出檔案 (App Shell Interfaces Unified Export)
 * @description 存放 App Shell 相關介面的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Shared Layer App Shell Interfaces
 * - 職責：App Shell 介面統一導出
 * - 依賴：App Shell 相關介面
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放 App Shell 介面的統一導出，不包含業務邏輯
 * - 所有 App Shell 相關介面必須在此檔案中導出
 */

export { IAppShell, IAppShellService, SidebarState, Theme } from './app-shell.interface';
export { IOfflineService, IOfflineStatus } from './offline.interface';

