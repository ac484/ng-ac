/**
 * @fileoverview 側邊欄組件 (Sidebar Component)
 * @description 使用Angular Material實現的超極簡側邊欄組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Layout Component
 * - 職責：超極簡側邊欄組件，一行解決
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現側邊欄
 * - 採用超極簡主義設計，一行解決
 * - 只提供最基本的側邊欄功能
 */

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, RouterModule],
  template: `<mat-nav-list style="width: 250px;"><a mat-list-item routerLink="/app/dashboard">儀表板</a><a mat-list-item routerLink="/app/users">用戶管理</a><a mat-list-item routerLink="/app/organizations">組織管理</a></mat-nav-list>`,
  styles: [``]
})
export class SidebarComponent {}
