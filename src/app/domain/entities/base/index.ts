/**
 * @fileoverview 基礎實體統一導出檔案 (Base Entities Unified Export)
 * @description 存放基礎實體的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Base Entities
 * - 職責：基礎實體統一導出
 * - 依賴：基礎實體
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

// 基礎實體類
export * from './base.entity';

// 審計實體
export * from './audit.entity';

// 時間戳實體
export * from './timestamped.entity';
