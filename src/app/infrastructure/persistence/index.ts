/**
 * @fileoverview 數據持久化統一導出檔案 (Data Persistence Unified Export)
 * @description 存放數據持久化的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Data Persistence
 * - 職責：數據持久化統一導出
 * - 依賴：數據持久化模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放數據持久化的統一導出，不包含業務邏輯
 * - 所有數據持久化模組必須在此檔案中導出
 */

// Firebase 服務導出
export * from './firebase';
