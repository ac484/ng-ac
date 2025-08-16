/**
 * @fileoverview 認證守衛 (Authentication Guard)
 * @description 保護需要認證的路由
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Security Layer Authentication Guard
 * - 職責：路由認證保護
 * - 依賴：認證服務
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供基本的認證保護功能
 * - 使用極簡主義設計，避免過度複雜化
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // 未登錄則重定向到登錄頁面
    this.router.navigate(['/auth/login']);
    return false;
  }
}
