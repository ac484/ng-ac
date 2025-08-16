/**
 * @fileoverview Firebase 倉儲統一導出檔案 (Firebase Repositories Unified Export)
 * @description 存放 Firebase 倉儲的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Firebase Repositories
 * - 職責：Firebase 倉儲統一導出
 * - 依賴：Firebase 倉儲
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放 Firebase 倉儲的統一導出，不包含業務邏輯
 * - 所有 Firebase 倉儲必須在此檔案中導出
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

export { BaseEntity, FirebaseBaseRepository } from './firebase-base.repository';
export * from './user';

