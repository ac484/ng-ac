/**
 * @fileoverview 領域層統一導出檔案 (Domain Layer Unified Export)
 * @description 存放領域層的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Unified Export
 * - 職責：領域層統一導出
 * - 依賴：領域層各模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放領域層的統一導出，不包含業務邏輯
 * - 所有領域層模組必須在此檔案中導出
 * - 此檔案須遵守DDD架構規則
 * - 此檔案須遵守清潔架構原則
 * - 此檔案須遵守依賴倒置原則
 * - 此檔案須遵守單一職責原則
 * - 此檔案須遵守開放封閉原則
 * - 此檔案須遵守里氏替換原則
 */

// 實體導出
export * from './entities';

// 值對象導出 (待實現)
// export * from './value-objects';

// 聚合根導出
export * from './aggregates';

// 倉儲接口導出
export * from './repositories';

// 領域服務導出
export * from './services';

// 工廠導出
export * from './factories';

// 領域事件導出 (待實現)
// export * from './events';

// 規格模式導出 (待實現)
// export * from './specifications';

// 領域異常導出 (待實現)
// export * from './exceptions';
