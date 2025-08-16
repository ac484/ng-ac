/**
 * @fileoverview 模組層統一導出檔案 (Modules Layer Unified Export)
 * @description 存放模組層的統一導出檔案，功能模組聚合匯出
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Modules Layer Unified Export
 * - 職責：功能模組聚合匯出
 * - 依賴：核心層
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只做功能模組聚合匯出，不包含業務邏輯
 * - 所有功能模組必須在此檔案中聚合導出
 * - 此檔案須遵守功能聚合原則
 * - 此檔案須遵守模組化原則
 * - 此檔案須遵守依賴倒置原則
 * - 此檔案須遵守單一職責原則
 * - 此檔案須遵守開放封閉原則
 * - 此檔案須遵守里氏替換原則
 */

// 核心層聚合導出
export * from '../core';

// 用戶模組導出 (待實現)
// export * from './user';

// 組織模組導出 (待實現)
// export * from './organization';

// 認證模組導出 (待實現)
// export * from './auth';

// 權限模組導出 (待實現)
// export * from './permission';

// App Shell 模組導出
export * from './app-shell';
