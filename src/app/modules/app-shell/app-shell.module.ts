/**
 * @fileoverview App Shell 功能模組 (App Shell Feature Module)
 * @description 整合 App Shell 相關的組件、服務和功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-12-19
 *
 * 檔案性質：
 * - 類型：Modules Layer App Shell Module
 * - 職責：App Shell 功能聚合
 * - 依賴：App Shell 相關模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 功能模組聚合，不包含業務邏輯
 * - 提供統一的模組入口
 * - 支援懶加載和路由配置
 * - 極簡主義實現
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppShellComponent } from '../../interface/components/layout/app-shell';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppShellComponent
      }
    ])
  ],
  providers: []
})
export class AppShellModule { }

// 模組聚合配置
export const AppShellModuleConfig = {
  // 實體和領域服務
  domain: () => import('../../domain/entities/app-shell'),

  // 應用用例
  useCases: () => import('../../application/services/app-shell'),

  // 頁面組件
  pages: () => import('../../interface/components/layout/app-shell'),

  // 路由配置
  routes: () => import('../../interface/components/layout/app-shell'),

  // 核心服務
  core: () => import('../../core')
};
