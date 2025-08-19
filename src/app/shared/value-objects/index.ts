/**
 * @fileoverview 值物件統一導出檔案 (Value Objects Unified Export)
 * @description 存放值物件的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Value Objects
 * - 職責：值物件統一導出
 * - 依賴：值物件
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放值物件的統一導出，不包含業務邏輯
 * - 所有值物件必須在此檔案中導出
 * - 此檔案須遵守值物件不可變性原則
 * - 此檔案須遵守值物件業務規則封裝原則
 * - 此檔案須遵守值物件類型安全原則
 * - 此檔案須遵守值物件測試覆蓋原則
 */

// 現代 DDD 值物件
export * from './sidebar-state.vo';
export * from './theme.vo';

// 基礎值物件類別
export * from '../base/value-objects/base-value-object';

