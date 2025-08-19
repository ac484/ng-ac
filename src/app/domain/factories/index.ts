/**
 * @fileoverview 工廠統一導出檔案 (Factories Unified Export)
 * @description 存放工廠的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-01-18
 *
 * 檔案性質：
 * - 類型：Domain Layer Factories
 * - 職責：工廠統一導出
 * - 依賴：工廠類
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放工廠的統一導出，不包含業務邏輯
 * - 所有工廠必須在此檔案中導出
 * - 此檔案須遵守DDD工廠模式原則
 * - 此檔案須遵守聚合根創建原則
 * - 此檔案須遵守業務規則封裝原則
 */

// 現代 DDD 工廠
export * from './app-shell.factory';

