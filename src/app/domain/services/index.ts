/**
 * @fileoverview 領域層服務統一導出檔案 (Domain Layer Services Unified Export)
 * @description 領域層所有領域服務的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Services Export
 * - 職責：領域層服務統一導出
 * - 依賴：所有領域服務
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 */

// 現有領域服務
export * from './app-shell.domain.service';
export * from './auth.domain.service';

// 合約相關領域服務
export * from './contracts';


