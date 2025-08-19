/**
 * @fileoverview 共享基礎層統一導出檔案 (Shared Base Layer Unified Export)
 * @description 存放共享基礎層的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Base
 * - 職責：共享基礎層統一導出
 * - 依賴：基礎類別
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放共享基礎層的統一導出，不包含業務邏輯
 * - 所有基礎類別必須在此檔案中導出
 * - 此檔案須遵守基礎抽象統一化原則
 * - 此檔案須遵守抽象類設計原則
 * - 此檔案須遵守繼承關係管理原則
 * - 此檔案須遵守通用屬性定義原則
 * - 此檔案須遵守通用方法定義原則
 * - 此檔案須遵守類型安全原則
 * - 此檔案須遵守性能優化原則
 * - 此檔案須遵守測試友好原則
 */

// 傳統基礎實體（向後兼容）
export * from './entities/base.entity';

// 現代 DDD 基礎類別
export * from './aggregates/base-aggregate';
export * from './entities/modern-base-entity';
export * from './result/result';
export * from './value-objects/base-value-object';

