/**
 * @fileoverview App Shell 服務統一導出檔案 (App Shell Services Unified Export)
 * @description 存放 App Shell 相關服務的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Application Layer App Shell Services
 * - 職責：App Shell 服務統一導出
 * - 依賴：App Shell 相關服務
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放 App Shell 服務的統一導出，不包含業務邏輯
 * - 所有 App Shell 相關服務必須在此檔案中導出
 */

export { AppShellService } from './app-shell.service';
export { OfflineService } from './offline.service';
export { PwaService } from './pwa.service';

