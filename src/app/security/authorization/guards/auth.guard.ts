/**
 * @fileoverview 認證守衛 (Authentication Guard)
 * @description 負責路由的認證保護
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Security Layer Authorization Guard
 * - 職責：路由認證保護
 * - 依賴：Router, Authentication Service
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 檢查用戶是否已認證
 * - 未認證時重定向到登錄頁面
 * - 極簡主義實現
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 檢查是否已認證 (極簡實現)
  const isAuthenticated = localStorage.getItem('ng-ac-auth-token');

  if (isAuthenticated) {
    return true;
  }

  // 未認證時重定向到登錄頁面
  router.navigate(['/auth/login']);
  return false;
};
