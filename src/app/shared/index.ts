/**
 * @fileoverview 共享層統一導出檔案 (Shared Layer Unified Export)
 * @description 存放共享層的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Unified Export
 * - 職責：共享層統一導出
 * - 依賴：共享層各模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放共享層的統一導出，不包含業務邏輯
 * - 所有共享層模組必須在此檔案中導出
 * - 此檔案須遵守通用資源原則
 * - 此檔案須遵守工具函數原則
 * - 此檔案須遵守依賴倒置原則
 * - 此檔案須遵守單一職責原則
 * - 此檔案須遵守開放封閉原則
 * - 此檔案須遵守里氏替換原則
 */

// 常量定義導出
export * from './constants';

// 枚舉定義導出
// export * from './enums';

// 接口定義導出
export * from './interfaces';

// 類型定義導出
// export * from './types';

// 工具函數導出
// export * from './utils';

// 裝飾器導出
// export * from './decorators';

// 管道導出
// export * from './pipes';

// 驗證器導出
// export * from './validators';

// 模型導出
// export * from './models';

// 共享異常導出
// export * from './exceptions';

// 共享組件導出
export * from './components';

// Material服務導出
export * from './services/material';

