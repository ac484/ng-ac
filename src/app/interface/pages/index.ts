/**
 * @fileoverview 頁面統一導出檔案 (Pages Unified Export)
 * @description 存放所有頁面的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Pages
 * - 職責：頁面統一導出
 * - 依賴：所有頁面
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放頁面的統一導出，不包含業務邏輯
 * - 所有頁面必須在此檔案中導出
 */

export * from './auth';
export * from './blank';
export * from './dashboard';
export * from './people/user';
export * from './public';

