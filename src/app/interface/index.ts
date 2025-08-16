/**
 * @fileoverview 接口層統一導出檔案 (Interface Layer Unified Export)
 * @description 存放接口層的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Unified Export
 * - 職責：接口層統一導出
 * - 依賴：接口層各模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放接口層的統一導出，不包含業務邏輯
 * - 所有接口層模組必須在此檔案中導出
 */

// 佈局導出
export * from './layouts';

// 頁面導出
export * from './pages';
