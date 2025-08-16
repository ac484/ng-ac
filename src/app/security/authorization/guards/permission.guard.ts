/**
 * @fileoverview 權限守衛 (Permission Guard)
 * @description 負責路由的權限控制
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Security Layer Authorization Guard
 * - 職責：路由權限控制
 * - 依賴：Router, Permission Service
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 檢查用戶是否具有所需權限
 * - 無權限時重定向到錯誤頁面
 * - 極簡主義實現
 */

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  
  // 從路由數據中獲取所需權限
  const requiredPermissions = route.data['permissions'] as string[];
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // 無權限要求時允許訪問
  }
  
  // 檢查用戶權限 (極簡實現)
  const userPermissions = JSON.parse(localStorage.getItem('ng-ac-user-permissions') || '[]');
  const hasPermission = requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
  
  if (hasPermission) {
    return true;
  }
  
  // 無權限時重定向到錯誤頁面
  router.navigate(['/error/403']);
  return false;
};
