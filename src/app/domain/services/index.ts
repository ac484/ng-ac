/**
 * @fileoverview 領域服務統一導出檔案 (Domain Services Unified Export)
 * @description 存放領域服務的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Services
 * - 職責：領域服務統一導出
 * - 依賴：領域服務
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放領域服務的統一導出，不包含業務邏輯
 * - 所有領域服務必須在此檔案中導出
 * - 此檔案須遵守DDD領域服務原則
 * - 此檔案須遵守純業務邏輯原則
 * - 此檔案須遵守無狀態原則
 * - 此檔案須遵守業務規則封裝原則
 * - 此檔案須遵守業務專家語言原則
 */

// 現代 DDD 領域服務
export * from './app-shell.domain.service';


