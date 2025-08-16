/**
 * @fileoverview 核心層統一導出檔案 (Core Layer Unified Export)
 * @description 存放核心層的統一導出檔案，聚合所有核心服務
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Core Layer Unified Export
 * - 職責：核心服務聚合匯出
 * - 依賴：六大核心層
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只做聚合匯出，不包含業務邏輯
 * - 所有核心層服務必須在此檔案中聚合導出
 * - 此檔案須遵守服務聚合原則
 * - 此檔案須遵守統一入口原則
 * - 此檔案須遵守依賴倒置原則
 * - 此檔案須遵守單一職責原則
 * - 此檔案須遵守開放封閉原則
 * - 此檔案須遵守里氏替換原則
 */

// 領域層聚合導出
export * from '../domain';

// 應用層聚合導出
export * from '../application';

// 基礎設施層聚合導出
export * from '../infrastructure';

// 接口層聚合導出
export * from '../interface';

// 安全層聚合導出
export * from '../security';

// 共享層聚合導出
export * from '../shared';
