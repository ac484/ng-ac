/**
 * @fileoverview 角色守衛 (Role Guard)
 * @description 負責路由的角色控制
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Security Layer Authorization Guard
 * - 職責：路由角色控制
 * - 依賴：Router, Role Service
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 檢查用戶是否具有所需角色
 * - 無角色時重定向到錯誤頁面
 * - 極簡主義實現
 */

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  
  // 從路由數據中獲取所需角色
  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // 無角色要求時允許訪問
  }
  
  // 檢查用戶角色 (極簡實現)
  const userRoles = JSON.parse(localStorage.getItem('ng-ac-user-roles') || '[]');
  const hasRole = requiredRoles.some(role => 
    userRoles.includes(role)
  );
  
  if (hasRole) {
    return true;
  }
  
  // 無角色時重定向到錯誤頁面
  router.navigate(['/error/403']);
  return false;
};
