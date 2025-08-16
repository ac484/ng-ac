/**
 * @fileoverview 授權守衛統一導出檔案 (Authorization Guards Unified Export)
 * @description 存放授權守衛的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Security Layer Authorization Guards
 * - 職責：授權守衛統一導出
 * - 依賴：授權守衛
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放授權守衛的統一導出，不包含業務邏輯
 * - 所有授權守衛必須在此檔案中導出
 */

export { authGuard } from './auth.guard';
export { permissionGuard } from './permission.guard';
export { roleGuard } from './role.guard';
