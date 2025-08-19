/**
 * @fileoverview 配置管理統一導出檔案 (Configuration Management Unified Export)
 * @description 存放配置管理的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Configuration Management
 * - 職責：配置管理統一導出
 * - 依賴：配置管理模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放配置管理的統一導出，不包含業務邏輯
 * - 所有配置管理模組必須在此檔案中導出
 */

// Firebase 配置導出
export * from './firebase';
