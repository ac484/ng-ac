/**
 * @fileoverview 用戶 Firebase 倉儲統一導出檔案 (User Firebase Repository Unified Export)
 * @description 存放用戶 Firebase 倉儲的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer User Firebase Repository
 * - 職責：用戶 Firebase 倉儲統一導出
 * - 依賴：用戶 Firebase 倉儲
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放用戶 Firebase 倉儲的統一導出，不包含業務邏輯
 * - 所有用戶 Firebase 倉儲必須在此檔案中導出
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

export { UserEntity, UserFirebaseRepository } from './user.firebase.repository';

